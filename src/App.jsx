import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "./data/data";

const App = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [loading, setLoading] = useState(false);

    // Handle file selection
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Handle file upload
    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file to upload");
            return;
        }

        setLoading(true); // Show loader
        try {
            const formData = new FormData();
            formData.append("image", selectedFile);

            const response = await axios.post(`${API_URL}upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Image uploaded successfully!");
            setUploadedImages((prev) => [...prev, response.data.image]);
            setSelectedFile(null);
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image");
        } finally {
            setLoading(false); // Hide loader
        }
    };

    // Fetch all uploaded images on component load
    useEffect(() => {
        const fetchAllImages = async () => {
            try {
                const response = await axios.get(`${API_URL}/images`);
                setUploadedImages(response.data);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        fetchAllImages();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            <header className="w-full bg-green-500 text-white py-4 shadow-lg">
                <h1 className="text-center text-2xl font-bold">Image Upload</h1>
            </header>

            <main className="w-full max-w-4xl p-4 mt-6">
                {/* Upload Section */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Upload an Image
                    </h2>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="block w-full md:w-auto text-sm text-gray-600 border border-gray-300 rounded-md p-2"
                        />
                        <button
                            onClick={handleUpload}
                            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow hover:bg-green-600 transition"
                        >
                            {loading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                    {selectedFile && (
                        <p className="mt-2 text-sm text-gray-500">
                            Selected file: {selectedFile.name}
                        </p>
                    )}
                </div>

                {/* Display Uploaded Images */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Uploaded Images
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {uploadedImages.map((image) => (
                            <div
                                key={image._id}
                                className="border border-gray-300 rounded-lg p-2"
                            >
                                <img
                                    src={image.imageUrl}
                                    alt={image.name}
                                    className="w-full h-40 object-cover rounded"
                                />
                                <p className="mt-2 text-sm text-gray-600 truncate">
                                    {image.name}
                                </p>
                            </div>
                        ))}
                    </div>
                    {uploadedImages.length === 0 && (
                        <p className="text-gray-500 text-center mt-4">
                            No images uploaded yet.
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default App;
