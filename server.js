const express=require("express"),mongoose=require("mongoose"),cors=require("cors"),dotenv=require("dotenv"),path=require("path"),ExcelJS=require("exceljs");
dotenv.config();
const app=express(); app.use(cors()); app.use(express.json()); app.use(express.static(path.join(__dirname,"public")));
const PORT=process.env.PORT||3000;
mongoose.connect(process.env.MONGODB_URI).then(()=>console.log("MongoDB connected")).catch(e=>console.error(e));
const schema=new mongoose.Schema({deviceId:String,temperature:Number,ph:Number,turbidity:Number,tds:Number,createdAt:{type:Date,default:Date.now}});
const Reading=mongoose.model("Reading",schema);
app.get("/health",(req,res)=>res.json({status:"online",service:"AquaSense API"}));
app.post("/api/readings",async(req,res)=>{
  if(req.headers["x-api-key"]!==process.env.ESP32_API_KEY)return res.status(401).json({error:"Unauthorized"});
  const {deviceId,temperature,ph,turbidity,tds}=req.body;
  if([deviceId,temperature,ph,turbidity,tds].some(v=>v===undefined))return res.status(400).json({error:"Missing sensor data"});
  const reading=await Reading.create({deviceId,temperature,ph,turbidity,tds});
  res.json({success:true,reading});
});
app.get("/api/readings/latest",async(req,res)=>res.json(await Reading.find().sort({createdAt:-1}).limit(100)));
app.get("/api/readings/export",async(req,res)=>{
  const rows=await Reading.find().sort({createdAt:-1}); const wb=new ExcelJS.Workbook(),ws=wb.addWorksheet("Water Quality");
  ws.columns=[{header:"Date & Time",key:"createdAt",width:25},{header:"Device ID",key:"deviceId",width:20},{header:"Temperature (°C)",key:"temperature",width:20},{header:"pH",key:"ph",width:12},{header:"Turbidity (NTU)",key:"turbidity",width:20},{header:"TDS (mg/L)",key:"tds",width:18}];
  rows.forEach(r=>ws.addRow(r.toObject()));
  res.setHeader("Content-Type","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition","attachment; filename=aquasense-water-quality.xlsx");
  await wb.xlsx.write(res); res.end();
});
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT,"0.0.0.0",()=>console.log(`AquaSense running on ${PORT}`));