'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const fetchProfileImages = async () => {
    try {
        const res = await fetch(`/api/db/updateProfile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json()
        return data
    } catch (error) {
        console.error("Error fetching profile images", error);
    }
}


export default function ProfileContainer() {
    const [profileImages, setProfileImages] = useState<{ [key: string]: string }>({});
    const [hasProfile, setHasProfile] = useState(false);

    //TODO : it should update after every purchase, rn it only updates on page load
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchProfileImages();

            if (data && data.success === true) {
                setProfileImages(data.clothesImagesMap);
                setHasProfile(true);
            } else {
                setHasProfile(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="w-1/2 flex items-center justify-center">
            {hasProfile === false ? (
                <div className="text-center text-red-500">
                    <p>No profile or fetching profile</p>
                </div>
            ): (
                <div 
                id="profile"
                style={{ 
                    position: "relative",
                    width: "200px",
                    height: "200px"
                }}
                >
                    {/* Dynamically Render Clothing Items (not sure how to style this well or if this is efficent) */}
                    {/*maybe another component for each item? */}
                    {Object.entries(profileImages).map(([type, imageUrl]) => (
                        <div
                        key={type}
                        className={type}
                        style={{
                            position: 'absolute',
                            top: type === 'hats' ? '30%' : type === 'glasses' ? '25%' : '50%',
                            left: '45%',
                            transform: 'translate(-50%, -50%)',
                            width: '100%',
                            height: '100%',
                        }}
                        >
                        <Image src={imageUrl} alt={`${type}`} width={100} height={100} />
                        </div>
                    ))}
                    <div>
                        {/*old penguin pfp */}
                        <div 
                        id="avatar"
                        style={{
                            width: "100%",
                            height: "100%"
                        }}
                        >
                            <Image 
                            src="/testvibbyBlue.png" 
                            alt="error" 
                            width={100} 
                            height={100} 
                            />
                        </div>

                        <div 
                        className="hats"
                        style={{
                            position: "absolute",
                            top: "30%",
                            left: "45%",
                            transform: "translate(-50%, -50%)",
                            width: "100%",
                            height: "100%"
                        }}
                        >
                            <Image 
                                src="/testHat.png" 
                                alt="Nothing" 
                                width={100} 
                                height={100}
                            />
                        </div>

                        <div 
                        className="glasses"
                        style={{
                            position: "absolute",
                            top: "65%",
                            left: "45%",
                            transform: "translate(-50%, -50%)",
                            width: "100%",
                            height: "100%"
                        }}
                        >
                            <Image 
                                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                                alt=""
                                width={100} 
                                height={100}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}