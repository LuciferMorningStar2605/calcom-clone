import { PrismaClient } from '@prisma/client'; 
import bcrypt from 'bcryptjs'; 
import { addDays, setHours, setMinutes, startOfDay } from 'date-fns'; 

const prisma = new PrismaClient(); 
const BookingStatus = {
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

async function main() { 
  console.log('🌱 Starting seed...'); 

  await prisma.booking.deleteMany(); 
  await prisma.availability.deleteMany(); 
  await prisma.eventType.deleteMany(); 
  await prisma.user.deleteMany(); 

  const hashedPassword = await bcrypt.hash('password123', 12); 

  const user = await prisma.user.create({ 
    data: { 
      email: 'demo@calclone.com', 
      name: 'Demo User', 
      username: 'demo', 
      password: hashedPassword, 
      bio: 'Open for intro calls and project consultations.', 
      timezone: 'America/New_York', 
    }, 
  }); 

  console.log(`✅ Created user: ${user.email}`); 

  const eventType1 = await prisma.eventType.create({ 
    data: { 
      title: 'Intro Call', 
      description: 'A quick intro call to discuss your goals and next steps.', 
      slug: 'intro-call', 
      duration: 30, 
      color: '#6366f1', 
      userId: user.id, 
    }, 
  }); 

  const eventType2 = await prisma.eventType.create({ 
    data: { 
      title: '60 Minute Consultation', 
      description: 'An in-depth consultation to dive deep into your project requirements.', 
      slug: '60min', 
      duration: 60, 
      color: '#0ea5e9', 
      userId: user.id, 
    }, 
  }); 

  console.log(`✅ Created event types: ${eventType1.title}, ${eventType2.title}`); 

  const workDays = [1, 2, 3, 4, 5]; 
  for (const day of workDays) { 
    await prisma.availability.create({ 
      data: { 
        userId: user.id, 
        dayOfWeek: day, 
        startTime: '09:00', 
        endTime: '17:00', 
        timezone: 'America/New_York', 
      }, 
    }); 
  } 

  console.log('✅ Created availability schedule (Mon–Fri, 09:00–17:00)'); 

  const tomorrow = addDays(startOfDay(new Date()), 1); 

  await prisma.booking.create({ 
    data: { 
      eventTypeId: eventType1.id, 
      guestName: 'Sarah Chen', 
      guestEmail: 'sarah.chen@example.com', 
      notes: 'Looking forward to discussing the new product roadmap.', 
      startTime: setMinutes(setHours(tomorrow, 10), 0), 
      endTime: setMinutes(setHours(tomorrow, 10), 30), 
      status: BookingStatus.CONFIRMED, 
    }, 
  }); 

  await prisma.booking.create({ 
    data: { 
      eventTypeId: eventType2.id, 
      guestName: 'Marcus Williams', 
      guestEmail: 'marcus@startup.io', 
      notes: 'Want to explore potential collaboration.', 
      startTime: setMinutes(setHours(tomorrow, 14), 0), 
      endTime: setMinutes(setHours(tomorrow, 15), 0), 
      status: BookingStatus.CONFIRMED, 
    }, 
  }); 

  const pastDate = addDays(startOfDay(new Date()), -3); 

  await prisma.booking.create({ 
    data: { 
      eventTypeId: eventType1.id, 
      guestName: 'Jordan Lee', 
      guestEmail: 'jordan.lee@company.com', 
      notes: 'Quick intro call.', 
      startTime: setMinutes(setHours(pastDate, 11), 0), 
      endTime: setMinutes(setHours(pastDate, 11), 30), 
      status: BookingStatus.COMPLETED, 
    }, 
  }); 

  console.log('✅ Created 3 sample bookings'); 
  console.log('\n🎉 Seed completed!'); 
  console.log('\n📋 Demo credentials:'); 
  console.log('   Email: demo@calclone.com'); 
  console.log('   Password: password123'); 
} 

main() 
  .catch((e) => { 
    console.error('❌ Seed failed:', e); 
    process.exit(1); 
  }) 
  .finally(async () => { 
    await prisma.$disconnect(); 
  }); 
