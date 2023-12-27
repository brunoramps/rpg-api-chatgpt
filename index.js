import express from 'express';
import authRoutes from './routes/authRoutes.js';
import characterRoutes from './routes/characterRoutes.js';
import battleRoutes from './routes/battleRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js'; // Adiciona esta linha


const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/characters', characterRoutes);
app.use('/battle', battleRoutes);
app.use('/inventory', inventoryRoutes); 


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
