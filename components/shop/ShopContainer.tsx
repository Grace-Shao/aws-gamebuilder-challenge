'use client';

import { useEffect, useState } from 'react';

import { Card, CardTitle, CardHeader, CardDescription, CardImage } from "@/components/ui/card";
import { Button } from '../ui/button';

interface ShopItem {
    itemId: number;
    imageUrl: string;
    price: number;
    name: string;
    type: string;
}

const fetchShopItems = async () => {
    try {
        const res = await fetch(`/api/db/inventory`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json()

        // Map the DynamoDB format to a simpler structure
        return data.map((item: any) => ({
            itemId: item.itemId.N,
            imageUrl: item.imageUrl.S,
            price: parseFloat(item.price.N),
            name: item.name.S,
            type: item.type.S,
        }));
    } catch(error) {
        console.error("Error loading shop items", error);
    }
}


export default function ShopContainer() {
    const [shopItems, setShopItems] = useState<ShopItem[]>([]);
    const [filteredShopItems, setFilteredShopItems] = useState<ShopItem[]>([]);

    useEffect(() => {
        async function getShopItems() {
            const data = await fetchShopItems();
            setShopItems(data);
            setFilteredShopItems(data);
        }
        getShopItems();
    }, []);

    const filterByItemType = (type: string) => {
        if (type === "all") {
            setFilteredShopItems(shopItems);
            return;
        }
        const filteredItems = shopItems.filter(item => item.type === type);
        setFilteredShopItems(filteredItems);
    }

    return (
        <div>
            <h1>Shop Items</h1>
            <Button onClick={() => filterByItemType("all")}>All</Button>
            <Button onClick={() => filterByItemType("hats")}>Hats</Button>
            <Button onClick={() => filterByItemType("glasses")}>Glasses</Button>
            <Button onClick={() => filterByItemType("collars")}>Collars</Button>
            <Button onClick={() => filterByItemType("frames")}>Frames</Button>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredShopItems.map((item, index) => (
                        <Card key={index} className="m-4">
                            <div className="w-1/3 mx-auto">
                                <CardImage src={item.imageUrl} alt={item.name} width={100} height={100} />
                            </div>
                            <CardHeader>
                                <CardTitle>{item.name}</CardTitle>
                                <CardDescription>Price: ${item.price}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

        </div>
    )
}
