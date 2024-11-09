import { db } from "./dbConfig";
import { Notifications, Users } from "./schema";
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
        and(eq(Notifications.userId, userId), 
        eq(Notifications.isRead, false))
      )
      .execute();
  } catch (error) {
    console.error("Error getting notifications:", error);
    return [];
  }
}
