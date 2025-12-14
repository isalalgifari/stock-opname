import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes.js';
import warehouseRoutes from './routes/warehouse.routes.js';
import stockRoutes from './routes/stock.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import userdRoutes from './routes/user.route.js';
import 'dotenv/config';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userdRoutes);

app.listen(process.env.PORT, () => {
  console.log(`API running on port ${process.env.PORT}`);
});
