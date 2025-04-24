import moongose from 'mongoose';


const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        await moongose.connect(uri);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;