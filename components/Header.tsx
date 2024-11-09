'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu , Coins , Leaf , Search , Bell , User , ChevronDown , LogIn , LogOut } from 'lucide-react'
import {Button} from './ui/button'
import { DropdownMenu , DropdownMenuContent , DropdownMenuTrigger , DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { Badge } from './ui/badge'
import {Web3Auth } from '@web3auth/modal'
import { CHAIN_NAMESPACES , IProvider, WEB3AUTH_NETWORK } from '@web3auth/base'
import  {EthereumPrivateKeyProvider} from '@web3auth/ethereum-provider'
import { createUser, getNotifications, getUserByEmail } from '@/utils/db/action'
import { get } from 'http'
// import {useMediQuery} from 'react-responsive'

const clientId = process.env.WEB3_AUTH_CLIENT_ID

//chain config
const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainID: '0xaa36a7',
    rpcTarget:"https://rpc.ankr.com/auth_sepolia",
    displayName: 'SePolia Testnet', 
    blockExplorerUrl: 'https://sepolia.etherscan.io',
    ticker: 'ETH',
    tickerName: 'Ethereum',
    logo: 'https://assets.web3auth.io/evm-chains/sepolia.png',
}

const privateKeyProvider = new EthereumPrivateKeyProvider({
    //@ts-ignore
    config: chainConfig,
})

const web3Auth = new Web3Auth({
    // @ts-ignore
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET,
    privateKeyProvider: privateKeyProvider
})

interface HeaderProps {
    onMenuClick: () => void;
    totalEarnings: number;
}

export default function Header({ onMenuClick , totalEarnings }: HeaderProps) {
    const[provider , setProvider] = useState<IProvider | null>(null);
    const[loggedIn , setLoggedIn] = useState(false);
    const[loading , setLoading] = useState(true);
    const[userInfo , setUserInfo] = useState<any>(null);
    const pathname = usePathname();
    const [notifications , setNotifications] = useState<Notification[]>([]);
    const [balance , setBalance] = useState<number>(0);

    useEffect(()=>{

        //initialize web3Auth
        const init = async () => {
            try {
                await web3Auth.initModal();
                setProvider(web3Auth.provider);
                if(web3Auth.connected){
                    setLoggedIn(true);
                    //get user info
                    const user = await web3Auth.getUserInfo();
                    setUserInfo(user);

                    if(user.email){
                        //save user email to local storage
                        localStorage.setItem('userEmail' , user.email);
                        try{
                            //create user
                            await createUser(user.email , user.name || 'Anonymous');
                        }catch(error){
                            console.error('Error creating user:', error);
                        }
                    }
                }
            }catch(error){
                console.error('Error initializing web3Auth' , error);
            } finally {
                setLoading(false);
            }
        }

        init();
    },[]);

    useEffect(()=>{
        const fetchNotifications = async () => {
            //fetch notifications
            if(userInfo && userInfo.email){
                const user = await getUserByEmail(userInfo.email);
                if(user){
                    const unreadNotifications = await getNotifications(user.id);
                    setNotifications(unreadNotifications);
                }
            }
        }

        fetchNotifications();
        //fetch notifications every 30 seconds
        const notificationsInterval = setInterval(fetchNotifications , 30000);
        return () => clearInterval(notificationsInterval);
    },[userInfo]);

    

} 



