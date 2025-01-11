/* eslint-disable @typescript-eslint/no-explicit-any */
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
    s3Key: string;
    equipped: boolean;
    owned: boolean;
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
            price: item.price.N,
            name: item.name.S,
            type: item.type.S,
            equipped: item.equipped,
            owned: item.owned
        }));
    } catch (error) {
        console.error("Error loading shop items", error)
    }
}

const buyItem = async (item: ShopItem) => {
    try {
        await fetch('/api/db/inventory/buyItem', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newItemId: item.itemId, newItemPrice: item.price }),
        })
    } catch (err) {
        console.log(err)
    }
}

const equipItem = async (item: ShopItem) => {
    try {
        await fetch('/api/db/userProgress/updateItem', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newItemId: item.itemId, newItemType: item.type }),
        })
    } catch (err) {
        console.log(err)
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

    const handleBuyItem = (index: number) => {
        buyItem(filteredShopItems[index])

        const boughtItem = filteredShopItems[index]
        boughtItem.owned = true
        filteredShopItems[index] = boughtItem

        setFilteredShopItems(filteredShopItems.slice())
    }

    const handleEquipItem = (index: number) => {
        equipItem(filteredShopItems[index])

        const equippedItem = filteredShopItems[index]
        equippedItem.equipped = !equippedItem.equipped
        filteredShopItems[index] = equippedItem

        setFilteredShopItems(filteredShopItems.slice())
    }

    return (
        <div>
            <h1>Shop Items</h1>
            <Button onClick={() => filterByItemType("all")}>All</Button>
            <Button onClick={() => filterByItemType("hats")}>Hats</Button>
            <Button onClick={() => filterByItemType("glasses")}>Glasses</Button>
            <Button onClick={() => filterByItemType("collars")}>Collars</Button>
            <Button onClick={() => filterByItemType("avatar")}>Avatar</Button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredShopItems.map((item, index) => (
                    <Card key={index} className="m-4" style={{ backgroundColor: item.equipped ? "rgb(255 251 232 / var(--tw-bg-opacity, 1))" : "white"}}>
                        <div className="w-1/3 mx-auto">
                            <CardImage src={item.imageUrl} alt={item.name} width={100} height={100} />
                        </div>
                        <CardHeader>
                            <CardTitle>{item.name}</CardTitle>
                            <CardDescription>Price: ${item.price}</CardDescription>
                            {item.owned ?
                                (<Button onClick={() => {handleEquipItem(index)}}> {item.equipped? "Unequip" : "Equip" + " Item"}</Button>)
                                :
                                (<Button style={{backgroundColor: "#e25237"}} onClick={() => handleBuyItem(index)}>Buy Item</Button>)
                            }
                        </CardHeader>
                    </Card>
                ))}
            </div>

        </div>
    )
}
