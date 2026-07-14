import mongoose, { Schema } from "mongoose";

// Load MongoDB connection URI
let mongodbUri = process.env.MONGODB_URI || process.env.DATABASE_URL;

// Fallback to local MongoDB if not set or not a mongodb connection string
if (!mongodbUri || !mongodbUri.startsWith("mongodb")) {
  mongodbUri = "mongodb://127.0.0.1:27017/proposal-generator";
}

// Connect to MongoDB
mongoose.connect(mongodbUri).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Counter Schema for Auto-Incrementing Numeric IDs
const CounterSchema = new Schema({
  id: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

export const Counter = mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

export async function getNextSequenceValue(sequenceName: string): Promise<number> {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.seq;
}

// User Schema
const UserSchema = new Schema(
  {
    id: { type: Number, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    subscription: { type: String, default: "free" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// Pre-save hook to auto-increment User ID
UserSchema.pre("save", async function (next) {
  if (this.isNew && !this.id) {
    this.id = await getNextSequenceValue("userId");
  }
  next();
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);

// Proposal Schema
const ProposalSchema = new Schema(
  {
    id: { type: Number, unique: true },
    userId: { type: Number, required: true },
    clientName: { type: String, required: true },
    projectName: { type: String, required: true },
    projectDate: { type: String, required: true },
    clientIndustry: { type: String, required: true },
    projectType: { type: String, required: true },
    budgetRange: { type: String, required: true },
    logoUrl: { type: String },
    contactDetails: { type: String },
    signatureUrl: { type: String },
    status: { type: String, default: "draft" },
    sections: { type: Schema.Types.Mixed },
    enabledSections: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// Pre-save hook to auto-increment Proposal ID
ProposalSchema.pre("save", async function (next) {
  if (this.isNew && !this.id) {
    this.id = await getNextSequenceValue("proposalId");
  }
  next();
});

export const Proposal = mongoose.models.Proposal || mongoose.model("Proposal", ProposalSchema);
