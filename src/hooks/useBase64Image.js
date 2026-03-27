import { useState, useEffect } from 'react';
import api from '../lib/axios';

const useBase64Image = (filename) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!filename) {
            setLoading(false);
            return;
        }

        const fetchImage = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/images/${filename}`);
                setImageUrl(data.image);
                setError(null);
            } catch (err) {
                console.error(`Error loading image ${filename}:`, err);
                setError(err);
                setImageUrl(null);
            } finally {
                setLoading(false);
            }
        };

        fetchImage();
    }, [filename]);

    return { imageUrl, loading, error };
};

export default useBase64Image;
