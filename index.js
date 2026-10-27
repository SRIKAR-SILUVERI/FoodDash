import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const products = [
 {id:1,name:'Classic Smash Burger',category:'Burgers',price:189,rating:4.8,time:'20-25 min',tag:'Bestseller',description:'Juicy grilled patty, cheddar, lettuce and house sauce.',image:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85'},
 {id:2,name:'Margherita Pizza',category:'Pizza',price:249,rating:4.7,time:'25-30 min',tag:'Popular',description:'Stone-baked crust, mozzarella, basil and tomato.',image:'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=85'},
 {id:3,name:'Creamy Alfredo Pasta',category:'Pasta',price:229,rating:4.6,time:'20-25 min',tag:'Chef pick',description:'Silky parmesan cream sauce with herbs and garlic.',image:'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=900&q=85'},
 {id:4,name:'Crispy Chicken Bites',category:'Chicken',price:199,rating:4.8,time:'15-20 min',tag:'Bestseller',description:'Crunchy golden chicken with a smoky dip.',image:'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=85'},
 {id:5,name:'Avocado Power Bowl',category:'Healthy',price:219,rating:4.5,time:'15-20 min',tag:'Fresh',description:'Avocado, grains, greens and lemon dressing.',image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85'},
 {id:6,name:'Double Cheese Sandwich',category:'Sandwiches',price:159,rating:4.4,time:'15-20 min',tag:'Quick bite',description:'Toasted sourdough, melted cheese and tomato.',image:'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=85'},
 {id:7,name:'Loaded French Fries',category:'Sides',price:119,rating:4.6,time:'10-15 min',tag:'Add-on',description:'Crispy fries tossed with seasoning and herbs.',image:'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85'},
 {id:8,name:'Chocolate Lava Cake',category:'Desserts',price:139,rating:4.9,time:'15-20 min',tag:'Sweet treat',description:'Warm chocolate cake with a gooey centre.',image:'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85'},
 {id:9,name:'Berry Smoothie',category:'Drinks',price:129,rating:4.5,time:'5-10 min',tag:'Refreshing',description:'A cool blend of berries, yogurt and banana.',image:'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=900&q=85'},
 {id:10,name:'Spicy Paneer Wrap',category:'Healthy',price:179,rating:4.6,time:'15-20 min',tag:'Veg favourite',description:'Spiced paneer, crunchy veggies and mint yogurt.',image:'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=85'},
 {id:11,name:'Pepperoni Pizza',category:'Pizza',price:329,rating:4.8,time:'25-30 min',tag:'Fan favourite',description:'Classic pepperoni, mozzarella and tangy tomato sauce.',image:'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=85'},
 {id:12,name:'Butter Chicken Bowl',category:'Chicken',price:259,rating:4.7,time:'25-30 min',tag:'Comfort food',description:'Creamy tomato curry with fragrant rice.',image:'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=85'}
];
const ordersFile = path.join(__dirname, 'orders.json');
if (!fs.existsSync(ordersFile)) fs.writeFileSync(ordersFile, '[]');
app.get('/api/health', (_req,res)=>res.json({status:'ok',service:'FoodDash API'}));
app.get('/api/products', (req,res)=>{
 const q=(req.query.q||'').toString().toLowerCase();
 const category=(req.query.category||'All').toString();
 let result=products.filter(p=>(category==='All'||p.category===category)&&(!q||`${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q)));
 res.json({products:result,categories:['All',...new Set(products.map(p=>p.category))]});
});
app.get('/api/orders', (_req,res)=>res.json(JSON.parse(fs.readFileSync(ordersFile,'utf8'))));
app.get('/api/orders/:id',(req,res)=>{
 const orders=JSON.parse(fs.readFileSync(ordersFile,'utf8'));
 const order=orders.find(o=>o.id.toLowerCase()===String(req.params.id).toLowerCase());
 if(!order)return res.status(404).json({error:'We could not find that order. Check the order ID and try again.'});
 res.json({order});
});
app.post('/api/orders',(req,res)=>{
 const {customer,items,address,paymentMethod='Cash on delivery'}=req.body;
 if(!customer?.name||!customer?.phone||!address||!Array.isArray(items)||!items.length) return res.status(400).json({error:'Please provide name, phone, address and at least one item.'});
 const normalized=items.map(item=>{const p=products.find(x=>x.id===Number(item.id));const quantity=Math.max(1,Math.min(50,Number(item.quantity)||1));return p?{id:p.id,name:p.name,price:p.price,quantity}:null}).filter(Boolean);
 if(!normalized.length) return res.status(400).json({error:'No valid products in order.'});
 const orders=JSON.parse(fs.readFileSync(ordersFile,'utf8'));
 const order={id:`FD${Date.now().toString().slice(-8)}`,customer:{name:String(customer.name).slice(0,100),phone:String(customer.phone).slice(0,30)},address:String(address).slice(0,300),paymentMethod:String(paymentMethod),items:normalized,total:normalized.reduce((sum,i)=>sum+i.price*i.quantity,0)+29,status:'Order received',statusHistory:[{status:'Order received',at:new Date().toISOString()}],createdAt:new Date().toISOString(),estimatedDeliveryMinutes:35};
 orders.unshift(order);fs.writeFileSync(ordersFile,JSON.stringify(orders,null,2));res.status(201).json({message:'Order placed successfully!',order});
});
app.listen(PORT,()=>console.log(`FoodDash API running at http://localhost:${PORT}`));
