import Navbar from '@/components/Navbar';
import ShopContainer from '../../components/shop/ShopContainer';
import ProfileContainer from '@/components/shop/ProfileContainer';

const ShopPage = () => {
    
    return (
        <div>
            <Navbar />
            <div className="flex h-screen">
                <ProfileContainer />
                <div className="w-1/2">
                    <ShopContainer />
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
