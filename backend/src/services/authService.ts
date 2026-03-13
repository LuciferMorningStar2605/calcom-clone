import bcrypt from 'bcryptjs'; 
import { prisma } from '../lib/prisma.js'; 
import { signToken } from '../utils/jwt.js'; 
import { 
  BadRequestError, 
  UnauthorizedError, 
  ConflictError, 
} from '../utils/errors.js'; 

interface RegisterInput { 
  name: string; 
  email: string; 
  username: string; 
  password: string; 
  timezone?: string; 
} 

interface LoginInput { 
  email: string; 
  password: string; 
} 

export async function registerUser(input: RegisterInput) { 
  const { name, email, username, password, timezone } = input; 

  const existingEmail = await prisma.user.findUnique({ where: { email } }); 
  if (existingEmail) throw new ConflictError('Email already in use'); 

  const existingUsername = await prisma.user.findUnique({ 
    where: { username }, 
  }); 
  if (existingUsername) throw new ConflictError('Username already taken'); 

  const hashedPassword = await bcrypt.hash(password, 12); 

  const user = await prisma.user.create({ 
    data: { 
      name, 
      email, 
      username: username.toLowerCase(), 
      password: hashedPassword, 
      timezone: timezone || 'UTC', 
    }, 
    select: { 
      id: true, 
      name: true, 
      email: true, 
      username: true, 
      timezone: true, 
      createdAt: true, 
    }, 
  }); 

  const token = signToken({ userId: user.id, email: user.email }); 
  return { user, token }; 
} 

export async function loginUser(input: LoginInput) { 
  const { email, password } = input; 

  const user = await prisma.user.findUnique({ where: { email } }); 
  if (!user) throw new UnauthorizedError('Invalid email or password'); 

  const isPasswordValid = await bcrypt.compare(password, user.password); 
  if (!isPasswordValid) 
    throw new UnauthorizedError('Invalid email or password'); 

  const { password: _, ...safeUser } = user; 
  const token = signToken({ userId: user.id, email: user.email }); 

  return { user: safeUser, token }; 
} 

export async function getUserProfile(userId: string) { 
  const user = await prisma.user.findUnique({ 
    where: { id: userId }, 
    select: { 
      id: true, 
      name: true, 
      email: true, 
      username: true, 
      bio: true, 
      timezone: true, 
      avatarUrl: true, 
      createdAt: true, 
    }, 
  }); 

  if (!user) throw new BadRequestError('User not found'); 
  return user; 
} 

export async function updateUserProfile( 
  userId: string, 
  data: Partial<{ 
    name: string; 
    bio: string; 
    timezone: string; 
    username: string; 
  }> 
) { 
  if (data.username) { 
    const existing = await prisma.user.findFirst({ 
      where: { username: data.username, NOT: { id: userId } }, 
    }); 
    if (existing) throw new ConflictError('Username already taken'); 
  } 

  return prisma.user.update({ 
    where: { id: userId }, 
    data, 
    select: { 
      id: true, 
      name: true, 
      email: true, 
      username: true, 
      bio: true, 
      timezone: true, 
      avatarUrl: true, 
    }, 
  }); 
} 
