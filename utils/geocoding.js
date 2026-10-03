import "dotenv/config";
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js';

let geocodingClient = null;

const getGeocodingClient = () => {
    if (!geocodingClient && process.env.MAPBOX_TOKEN) {
        geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
    }
    return geocodingClient;
};

export const geocodeAddress = async (address) => {
    const client = getGeocodingClient();
    if (!client) {
        return { type: "Point", coordinates: [0, 0] };
    }
    
    try {
        const match = await client.forwardGeocode({
            query: address,
            limit: 1
        }).send();
        
        if (match.body.features && match.body.features.length > 0) {
            return match.body.features[0].geometry;
        }
    } catch (err) {
        console.error("Geocoding error:", err);
    }
    
    return { type: "Point", coordinates: [0, 0] };
};
