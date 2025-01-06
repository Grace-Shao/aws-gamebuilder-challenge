'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ShopContainer from '../../components/shop/ShopContainer';
import useMousePosition from '../utils/useMousePosition';
import Image from 'next/image'

const RoomPage = () => {
    const [isPlacingObject, setIsPlacingObject] = useState(false);
    const imageSize = 128
    const { x, y } = useMousePosition();

    useEffect(() => {
        if (isPlacingObject) {
            console.log(x, y);
        }
      }, [x, y, isPlacingObject]);

    const placeItem = () => {
        setIsPlacingObject((prev) => !prev);
    };

    return (
        <div className="flex h-screen">
            <div className="w-1/2 flex items-center justify-center">
                {/* Room side*/}
                <Button onClick={() => placeItem()}>Place bed</Button>
                <Image 
                    src="/roomAssets/room.png" 
                    alt="error" 
                    width={3000} 
                    height={3000} 
                />
                {isPlacingObject && (
                    <div 
                    style={{
                        position: "absolute",
                        top: y - (imageSize / 2),
                        left: x - (imageSize / 2),
                        opacity: 0.5,
                        pointerEvents: "none" // This ensures clicks pass through
                    }}
                    >
                        <Image 
                            src="/roomAssets/catBed.png" 
                            alt="catBed" 
                            width={128} 
                            height={128} 
                        />
                    </div>
                )}
               
            </div>
            <div className="w-1/2">
                <ShopContainer />
            </div>
        </div>
    );
};

export default RoomPage;
