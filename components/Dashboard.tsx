import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Trophy,
  Users
} from 'lucide-react';

// New Components to add after the Impact section and before Take Action

const CommunityHighlights = () => {
  // const [activeChallenge, setActiveChallenge] = useState(0);
  const challenges = [
    {
      title: "Weekend Warrior",
      description: "Clean 5kg of waste this weekend",
      reward: "500 tokens",
      participants: 128,
      timeLeft: "2 days"
    },
    {
      title: "Plastic Pioneer",
      description: "Collect 100 plastic bottles",
      reward: "300 tokens",
      participants: 85,
      timeLeft: "5 days"
    },
    {
      title: "Green Guardian",
      description: "Complete 3 cleanup missions",
      reward: "400 tokens",
      participants: 62,
      timeLeft: "1 week"
    }
  ];

  return (
    <motion.section 
      className="mb-12 sm:mb-20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.9 }}
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800">
        Active Challenges
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {challenges.map((challenge, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <Trophy className="text-yellow-500 w-8 h-8" />
              <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                {challenge.timeLeft} left
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
            <p className="text-gray-600 mb-4">{challenge.description}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">
                <Users className="inline w-4 h-4 mr-1" />
                {challenge.participants} joined
              </span>
              <span className="text-green-600 font-semibold">
                {challenge.reward}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

const HowItWorks = () => {
  return (
    <motion.section 
      className="mb-12 sm:mb-20 bg-green-50 rounded-3xl p-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800">
        How CleanBee Works
      </h2>
      <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg">
            1. Report Waste
          </AccordionTrigger>
          <AccordionContent>
            Use our app to report waste in your area. Take a photo, and our AI will automatically classify the waste type. Your report helps create a cleaner community!
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-lg">
            2. Complete Cleanups
          </AccordionTrigger>
          <AccordionContent>
            Choose cleanup tasks from our interactive map. Complete the cleanup and upload verification photos to earn rewards.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-lg">
            3. Earn Rewards
          </AccordionTrigger>
          <AccordionContent>
            Earn tokens for every verified cleanup. Participate in challenges for bonus rewards and climb the community leaderboard!
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.section>
  );
};

const UpcomingEvents = () => {
  const events = [
    {
      date: "Apr 22",
      title: "Earth Day Cleanup",
      location: "Central Park",
      reward: "1000 tokens"
    },
    {
      date: "Apr 25",
      title: "Beach Cleanup Drive",
      location: "Sunset Beach",
      reward: "800 tokens"
    },
    {
      date: "May 1",
      title: "Community Recycling Day",
      location: "City Center",
      reward: "750 tokens"
    }
  ];

  return (
    <motion.section 
      className="mb-12 sm:mb-20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-green-600" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-green-600">{event.date}</div>
                  </div>
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-gray-500">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      {event.location}
                    </div>
                  </div>
                </div>
                <div className="text-green-600 font-medium">{event.reward}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
};

// Export these components to be used in the main Home component
export { CommunityHighlights, HowItWorks, UpcomingEvents };

