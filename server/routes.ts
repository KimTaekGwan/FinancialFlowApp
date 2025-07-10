import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema, insertConversationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get user profile
  app.get("/api/user/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user transactions
  app.get("/api/transactions/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const transactions = await storage.getTransactions(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create new transaction
  app.post("/api/transactions", async (req, res) => {
    try {
      const result = insertTransactionSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid transaction data" });
      }

      const transaction = await storage.createTransaction(result.data);
      
      // Update user balance if it's a send transaction
      if (result.data.type === "send") {
        const user = await storage.getUser(result.data.userId);
        if (user) {
          const currentBalance = parseFloat(user.balance || "0");
          const transactionAmount = parseFloat(result.data.amount);
          const newBalance = (currentBalance - transactionAmount).toString();
          await storage.updateUserBalance(result.data.userId, newBalance);
        }
      }

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user contacts
  app.get("/api/contacts/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const contacts = await storage.getContacts(userId);
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get frequent contacts
  app.get("/api/contacts/:userId/frequent", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const contacts = await storage.getFrequentContacts(userId);
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get AI conversations
  app.get("/api/conversations/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create AI conversation
  app.post("/api/conversations", async (req, res) => {
    try {
      const result = insertConversationSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid conversation data" });
      }

      // Simple AI response simulation
      let response = "죄송합니다. 잘 이해하지 못했어요. 다시 말씀해 주시겠어요?";
      
      if (result.data.message.includes("잔액") || result.data.message.includes("돈")) {
        response = "현재 잔액은 2,847,500원입니다. 다른 도움이 필요하시면 말씀해 주세요!";
      } else if (result.data.message.includes("송금") || result.data.message.includes("보내")) {
        response = "송금을 도와드릴게요! 누구에게 얼마를 보내실 건가요?";
      } else if (result.data.message.includes("거래내역")) {
        response = "최근 거래내역을 확인해 드릴게요. 거래내역 화면으로 이동할까요?";
      }

      const conversationWithResponse = {
        ...result.data,
        response,
      };

      const conversation = await storage.createConversation(conversationWithResponse);
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
