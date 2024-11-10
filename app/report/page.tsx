"use client"
import { useState, useCallback, useEffect } from 'react'
import { MapPin, Upload, CheckCircle, Loader, Book } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GoogleGenerativeAI } from "@google/generative-ai"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { createUser, getUserByEmail, createReport, getRecentReports } from '@/utils/db/action'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

// Environment variables
const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

mapboxgl.accessToken = mapboxToken!

export default function ReportPage() {
  
  // State
  const [user, setUser] = useState<{ id: number; email: string; name: string } | null>(null)
  const router = useRouter()
  const [map, setMap] = useState<mapboxgl.Map | null>(null)

  const [reports, setReports] = useState<Array<{
    id: number
    location: string
    wasteType: string
    amount: string
    createdAt: string
  }>>([])

  // report form state
  const [newReport, setNewReport] = useState({
    location: '',
    type: '',
    amount: '',
  })

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'failure'>('idle')
  const [verificationResult, setVerificationResult] = useState<{
    wasteType: string
    quantity: string
    confidence: number
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [locationName, setLocationName] = useState<string>('')



  // coverting coordinates to location name
  const reverseGeocode = async (lng: number, lat: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        // Get the most relevant place name
        const place = data.features[0];
        const locationName = place.place_name;
        return locationName;
      }
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  // useEffect for map changes
  useEffect(() => {
    
    // Initialize map of mapbox
    const mapInstance = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 2
    })

    // Add geocoder to map
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxToken!,
      mapboxgl: mapboxgl,
      marker: false,
    })

    mapInstance.addControl(geocoder)

    mapInstance.on('load', () => {
      mapInstance.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      }))
    })

    // Handle geocoder results
    geocoder.on('result', (e) => {
      const { place_name, center } = e.result
      setNewReport(prev => ({
        ...prev,
        location: place_name
      }))
      setLocationName(place_name)
      mapInstance.flyTo({ center, zoom: 14 })
    })

    mapInstance.on('moveend', async () => {
      const center = mapInstance.getCenter()
      const locationName = await reverseGeocode(center.lng, center.lat)
      setLocationName(locationName)
      setNewReport(prev => ({
        ...prev,
        location: locationName
      }))
    })

    // Add map to state
    setMap(mapInstance)

    return () => {
      mapInstance.remove()
    }
  }, [])


  // Handle input change for report form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewReport({ ...newReport, [name]: value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  // Read file as base64
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }


  // Handle verifying waste type
  const handleVerify = async () => {
    if (!file) return

    setVerificationStatus('verifying')
    
    // Verify waste using Google Generative AI
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey!)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const base64Data = await readFileAsBase64(file)

      const imageParts = [
        {
          inlineData: {
            data: base64Data.split(',')[1],
            mimeType: file.type,
          },
        },
      ]

      // Prompt for the model
      const prompt = `You are an expert in waste management and recycling. Analyze this image and provide:
        1. The type of waste (e.g., plastic, paper, glass, metal, organic)
        2. An estimate of the quantity or amount (in kg or liters)
        3. Your confidence level in this assessment (as a percentage)
        
        Respond in JSON format like this:
        {
          "wasteType": "type of waste",
          "quantity": "estimated quantity with unit",
          "confidence": confidence level as a number between 0 and 1
        }`

      // get the response from the model 
      const result = await model.generateContent([prompt, ...imageParts])
      const response = await result.response
      const text = response.text()
      
      try {
        const parsedResult = JSON.parse(text)
        if (parsedResult.wasteType && parsedResult.quantity && parsedResult.confidence) {
          setVerificationResult(parsedResult)
          setVerificationStatus('success')
          setNewReport({
            ...newReport,
            type: parsedResult.wasteType,
            amount: parsedResult.quantity
          })
        } else {
          console.error('Invalid verification result:', parsedResult)
          setVerificationStatus('failure')
        }
      } catch (error) {
        console.error('Failed to parse JSON response:', text)
        setVerificationStatus('failure')
      }
    } catch (error) {
      console.error('Error verifying waste:', error)
      setVerificationStatus('failure')
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if user is logged in and waste is verified
    if (verificationStatus !== 'success' || !user) {
      toast.error('Please verify the waste before submitting or log in.')
      return
    }
    
    setIsSubmitting(true)
    try {
      
      // Submit report to database
      const report = await createReport(
        user.id,
        newReport.location,
        newReport.type,
        newReport.amount,
        preview || undefined,
        verificationResult ? JSON.stringify(verificationResult) : undefined
      ) as any
      
      const formattedReport = {
        id: report.id,
        location: report.location,
        wasteType: report.wasteType,
        amount: report.amount,
        createdAt: report.createdAt.toISOString().split('T')[0]
      }
      
      // console.log('Report submitted:', formattedReport);
      
      // Update reports state
      setReports([formattedReport, ...reports])
      setNewReport({ location: '', type: '', amount: '' })
      setFile(null)
      setPreview(null)
      setVerificationStatus('idle')
      setVerificationResult(null)
      
      // Show success message
      toast.success(`Report submitted successfully! You've earned points for reporting waste.`)
    } catch (error) {
      console.error('Error submitting report:', error)
      toast.error('Failed to submit report. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const email = localStorage.getItem('userEmail')
      if (email) {
        let user = await getUserByEmail(email)
        if (!user) {
          user = await createUser(email, 'Anonymous User')
        }
        setUser(user)
        
        const recentReports = await getRecentReports()
        const formattedReports = recentReports.map(report => ({
          ...report,
          createdAt: report.createdAt.toISOString().split('T')[0]
        }))
        setReports(formattedReports)
      } else {
        // Redirect to login page if user is not logged in
        router.push('/login')
      }
    }
    checkUser()
  }, [router])

  // Handle waste guide button click
  const handleWasteGuideClick = () => {
    router.push('/waste-guide')
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Report waste</h1>
        <Button 
          onClick={handleWasteGuideClick}
          variant="outline"
          className="flex items-center gap-2 hover:bg-green-200 hover:text-green-700"
        >
          <Book className="w-4 h-4" />
          Waste Guide
        </Button>
      </div>
      
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg mb-12">
        
        {/* File upload */}
        <div className="mb-8">
          <label htmlFor="waste-image" className="block text-lg font-medium text-gray-700 mb-2">
            Upload Waste Image
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 transition-colors duration-300">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="waste-image"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500"
                >
                  <span>Upload a file</span>
                  <input id="waste-image" name="waste-image" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>
        
        {/* preview image */}
        {preview && (
          <div className="mt-4 mb-8">
            <img src={preview} alt="Waste preview" className="max-w-full h-auto rounded-xl shadow-md" />
          </div>
        )}

        {/* Verify waste */}
        <Button 
          type="button" 
          onClick={handleVerify} 
          className="w-full mb-8 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded-xl transition-colors duration-300" 
          disabled={!file || verificationStatus === 'verifying'}
        >
          {verificationStatus === 'verifying' ? (
            <>
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Verifying...
            </>
          ) : 'Verify Waste'}
        </Button>

        {/* Verification result */}
        {verificationStatus === 'success' && verificationResult && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8 rounded-r-xl">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-green-800">Verification Successful</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Waste Type: {verificationResult.wasteType}</p>
                  <p>Quantity: {verificationResult.quantity}</p>
                  <p>Confidence: {(verificationResult.confidence * 100).toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* map */}
        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Location
          </label>
          {/* map */}
          <div id="map" style={{ width: '100%', height: '400px' }} className="rounded-xl overflow-hidden shadow-md mb-2" />
          
          {/* display selected Location */}
          <div className="text-sm text-gray-600 mt-2">
            <MapPin className="inline-block w-4 h-4 mr-2 text-green-500" />
            Selected location: {locationName || 'No location selected'}
          </div>
        </div>
        
        {/* Waste type and amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Waste Type</label>
            <input
              type="text"
              id="type"
              name="type"
              value={newReport.type}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-gray-100"
              placeholder="Verified waste type"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Estimated Amount</label>
            <input
              type="text"
              id="amount"
              name="amount"
              value={newReport.amount}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-gray-100"
              placeholder="Verified amount"
              readOnly
            />
          </div>
        </div>
        
        {/* submit button */}
        <Button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl transition-colors duration-300 flex items-center justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Submitting...
            </>
          ) : 'Submit Report'}
        </Button>
      </form>

      {/* Recent reports */}
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Recent Reports</h2>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <MapPin className="inline-block w-4 h-4 mr-2 text-green-500" />
                    {report.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.wasteType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 