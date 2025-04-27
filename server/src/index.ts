import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';

import materialRoutes from './routes/materialRoutes';
import sortieRoutes from './routes/sortieRoutes';
import productionRoutes from './routes/productionRoutes';
import shiftRoutes from './routes/shiftRoutes';

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/materials", materialRoutes);
app.use("/sorties", sortieRoutes);
app.use("/productions", productionRoutes);
app.use("/shifts", shiftRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    });