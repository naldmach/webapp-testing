// Test data configuration and management

export interface TestUser {
  id?: string;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: "admin" | "user" | "moderator";
}

export interface TestProduct {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock?: boolean;
  imageUrl?: string;
}

export class TestDataManager {
  private static instance: TestDataManager;
  private users: TestUser[] = [];
  private products: TestProduct[] = [];

  private constructor() {
    this.initializeDefaultData();
  }

  public static getInstance(): TestDataManager {
    if (!TestDataManager.instance) {
      TestDataManager.instance = new TestDataManager();
    }
    return TestDataManager.instance;
  }

  private initializeDefaultData(): void {
    // Default test users
    this.users = [
      {
        username: "testuser",
        email: "testuser@example.com",
        password: "TestPassword123!",
        firstName: "Test",
        lastName: "User",
        role: "user",
      },
      {
        username: "adminuser",
        email: "admin@example.com",
        password: "AdminPassword123!",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
      },
      {
        username: "moderator",
        email: "moderator@example.com",
        password: "ModeratorPassword123!",
        firstName: "Moderator",
        lastName: "User",
        role: "moderator",
      },
    ];

    // Default test products
    this.products = [
      {
        name: "Test Product 1",
        description: "This is a test product for automation testing",
        price: 19.99,
        category: "Electronics",
        inStock: true,
        imageUrl: "https://via.placeholder.com/300x300",
      },
      {
        name: "Test Product 2",
        description: "Another test product for automation testing",
        price: 29.99,
        category: "Books",
        inStock: true,
        imageUrl: "https://via.placeholder.com/300x300",
      },
      {
        name: "Out of Stock Product",
        description: "This product is out of stock for testing",
        price: 39.99,
        category: "Clothing",
        inStock: false,
        imageUrl: "https://via.placeholder.com/300x300",
      },
    ];
  }

  // User management methods
  public getUser(role: "admin" | "user" | "moderator" = "user"): TestUser {
    const user = this.users.find((u) => u.role === role);
    if (!user) {
      throw new Error(`No test user found with role: ${role}`);
    }
    return { ...user }; // Return a copy
  }

  public getAllUsers(): TestUser[] {
    return [...this.users]; // Return a copy
  }

  public createUser(userData: Partial<TestUser>): TestUser {
    const timestamp = Date.now();
    const newUser: TestUser = {
      username: userData.username || `testuser${timestamp}`,
      email: userData.email || `test${timestamp}@example.com`,
      password: userData.password || "TestPassword123!",
      firstName: userData.firstName || "Test",
      lastName: userData.lastName || "User",
      role: userData.role || "user",
      id: `user_${timestamp}`,
    };

    this.users.push(newUser);
    return { ...newUser };
  }

  // Product management methods
  public getProduct(index = 0): TestProduct {
    if (index >= this.products.length) {
      throw new Error(`Product index ${index} out of range`);
    }
    return { ...this.products[index] };
  }

  public getAllProducts(): TestProduct[] {
    return [...this.products];
  }

  public getProductsByCategory(category: string): TestProduct[] {
    return this.products
      .filter((p) => p.category === category)
      .map((p) => ({ ...p }));
  }

  public getInStockProducts(): TestProduct[] {
    return this.products.filter((p) => p.inStock).map((p) => ({ ...p }));
  }

  public createProduct(productData: Partial<TestProduct>): TestProduct {
    const timestamp = Date.now();
    const newProduct: TestProduct = {
      name: productData.name || `Test Product ${timestamp}`,
      description: productData.description || "Auto-generated test product",
      price: productData.price || 19.99,
      category: productData.category || "Test Category",
      inStock: productData.inStock ?? true,
      imageUrl: productData.imageUrl || "https://via.placeholder.com/300x300",
      id: `product_${timestamp}`,
    };

    this.products.push(newProduct);
    return { ...newProduct };
  }

  // Utility methods
  public generateRandomEmail(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `test${timestamp}${random}@example.com`;
  }

  public generateRandomUsername(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `testuser${timestamp}${random}`;
  }

  public generateRandomPassword(): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Cleanup methods
  public clearGeneratedUsers(): void {
    this.users = this.users.filter((user) => !user.id?.startsWith("user_"));
  }

  public clearGeneratedProducts(): void {
    this.products = this.products.filter(
      (product) => !product.id?.startsWith("product_")
    );
  }

  public reset(): void {
    this.clearGeneratedUsers();
    this.clearGeneratedProducts();
    this.initializeDefaultData();
  }
}

// Export singleton instance
export const testData = TestDataManager.getInstance();
