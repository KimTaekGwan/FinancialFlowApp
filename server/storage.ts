import { 
  users, transactions, contacts, aiConversations,
  type User, type InsertUser, 
  type Transaction, type InsertTransaction,
  type Contact, type InsertContact,
  type AIConversation, type InsertConversation
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(userId: number, newBalance: string): Promise<User | undefined>;

  // Transaction operations
  getTransactions(userId: number): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Contact operations
  getContacts(userId: number): Promise<Contact[]>;
  getFrequentContacts(userId: number): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;

  // AI Conversation operations
  getConversations(userId: number): Promise<AIConversation[]>;
  createConversation(conversation: InsertConversation): Promise<AIConversation>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private transactions: Map<number, Transaction>;
  private contacts: Map<number, Contact>;
  private conversations: Map<number, AIConversation>;
  private currentUserId: number;
  private currentTransactionId: number;
  private currentContactId: number;
  private currentConversationId: number;

  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.contacts = new Map();
    this.conversations = new Map();
    this.currentUserId = 1;
    this.currentTransactionId = 1;
    this.currentContactId = 1;
    this.currentConversationId = 1;

    // Initialize with sample user
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleUser: User = {
      id: 1,
      name: "김순자",
      email: "kim.soonja@example.com",
      phone: "010-1234-5678",
      bankAccount: "KB국민은행 ****1234",
      balance: "2847500",
      createdAt: new Date(),
    };
    
    this.users.set(1, sampleUser);
    this.currentUserId = 2;

    // Sample contacts
    const contacts = [
      { id: 1, userId: 1, name: "손자 김민수", account: "****5678", bank: "신한은행", isFrequent: true },
      { id: 2, userId: 1, name: "딸 김영희", account: "****9012", bank: "하나은행", isFrequent: true },
    ];
    
    contacts.forEach(contact => {
      this.contacts.set(contact.id, contact);
    });
    this.currentContactId = 3;

    // Sample transactions
    const sampleTransactions = [
      {
        id: 1,
        userId: 1,
        type: "send",
        amount: "100000",
        recipient: "손자 김민수",
        recipientAccount: "****5678",
        description: "용돈입니다",
        status: "completed",
        createdAt: new Date(),
      },
      {
        id: 2,
        userId: 1,
        type: "receive",
        amount: "1240000",
        recipient: "국민연금공단",
        recipientAccount: "",
        description: "연금지급",
        status: "completed",
        createdAt: new Date(Date.now() - 86400000), // yesterday
      },
      {
        id: 3,
        userId: 1,
        type: "payment",
        amount: "8500",
        recipient: "스타벅스 강남점",
        recipientAccount: "",
        description: "카드결제",
        status: "completed",
        createdAt: new Date(),
      },
    ];

    sampleTransactions.forEach(transaction => {
      this.transactions.set(transaction.id, transaction);
    });
    this.currentTransactionId = 4;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserBalance(userId: number, newBalance: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      const updatedUser = { ...user, balance: newBalance };
      this.users.set(userId, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async getTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getContacts(userId: number): Promise<Contact[]> {
    return Array.from(this.contacts.values()).filter(contact => contact.userId === userId);
  }

  async getFrequentContacts(userId: number): Promise<Contact[]> {
    return Array.from(this.contacts.values())
      .filter(contact => contact.userId === userId && contact.isFrequent);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = {
      ...insertContact,
      id,
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getConversations(userId: number): Promise<AIConversation[]> {
    return Array.from(this.conversations.values())
      .filter(conversation => conversation.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createConversation(insertConversation: InsertConversation): Promise<AIConversation> {
    const id = this.currentConversationId++;
    const conversation: AIConversation = {
      ...insertConversation,
      id,
      createdAt: new Date(),
    };
    this.conversations.set(id, conversation);
    return conversation;
  }
}

export const storage = new MemStorage();
