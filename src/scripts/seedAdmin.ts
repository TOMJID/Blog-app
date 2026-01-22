import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
  try {
    console.log("***** Admin seeding started *****");
    const adminData = {
      name: "Admin tomjid",
      email: "tomjidhuda06@gmail.com",
      role: UserRole.ADMIN,
      password: "pass12345",
    };

    //? check if the user exists on db or not
    console.log("***** Checking if the user exists or not *****");
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      throw new Error("User already exists!");
    }

    console.log("***** Creating admin via API... *****");

    const createAdmin = await fetch(
      "http://localhost:3000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "content-type": "Application/json",
        },
        body: JSON.stringify(adminData),
      },
    );

    //? if the create has been created successfully the we update the emailVerified to true
    if (createAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
      console.log("***** Admin emailVerified successful *****");
    }

    console.log("***** Admin created successfully *****");
  } catch (error) {
    console.log(error);
    process.exit(1);
  } finally {
    console.log("Admin created successfully");
    await prisma.$disconnect();
  }
}

seedAdmin();
