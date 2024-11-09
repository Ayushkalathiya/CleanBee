import { db } from "./dbConfig";
import { Notifications, Users, Transactions } from "./schema";
import { eq, sql, and, desc } from "drizzle-orm";

// create a new user
export async function createUser(email: string, name: string) {
  try {
    // insert a new user
    const [user] = await db
      .insert(Users)
      .values({ email, name })
      .returning()
      .execute();
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

// get user by email
export async function getUserByEmail(email: string) {
  try {
    // get user by email
    const [user] = await db
      .select()
      .from(Users)
      .where(eq(Users.email, email))
      .execute();
    return user;
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
}

// get unread notifications
export async function getNotifications(userId: number) {
  try {
    // get unread notifications
    return await db
      .select()
      .from(Notifications)
      .where(
        and(eq(Notifications.userId, userId), eq(Notifications.isRead, false))
      )
      .execute();
  } catch (error) {
    console.error("Error getting notifications:", error);
    return [];
  }
}

// get user balance
export async function getUserBalance(userId: number) {
  try {
    const transactions = (await getRewardTransactions(userId)) || [];

    if (!transactions) {
      return null;
    }

    const balance = transactions.reduce((acc: number, transaction: any) => {
      return transaction.type.startsWith("earned")
        ? acc + transaction.amount
        : acc - transaction.amount;
    }, 0);

    return Math.max(balance, 0);
  } catch (error) {
    console.error("Error getting balance:", error);
    return null;
  }
}

export async function getRewardTransactions(userId: number) {
  try {
    // get reward transactions
    const transactions = await db
      .select({
        id: Transactions.id,
        type: Transactions.type,
        amount: Transactions.amount,
        description: Transactions.description,
        date: Transactions.date,
      })
      .from(Transactions)
      .where(eq(Transactions.userId, userId))
      .orderBy(desc(Transactions.date))
      .limit(10)
      .execute();

    // format date
    const formattedTransactions = transactions.forEach((transaction: any) => {
      transaction.date = transaction.date.toISOString().split("T")[0];
    });

    return formattedTransactions;
  } catch (error) {
    console.error("Error getting reward transactions:", error);
    return [];
  }
}
