import path from 'node:path'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const dbUrl = `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`
const adapter = new PrismaBetterSqlite3({ url: dbUrl })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@asianpsyche.org' },
    update: {},
    create: {
      email: 'admin@asianpsyche.org',
      password: adminPassword,
      role: 'ADMIN',
      member: {
        create: {
          firstName: 'Admin',
          lastName: 'AFP',
          bio: 'Администратор сайта Азиатской Федерации Психологов',
          specialization: JSON.stringify(['Клиническая психология']),
          country: 'RU',
          isPublic: false,
        },
      },
    },
  })
  console.log('Admin created:', admin.email)

  // Test members
  const members = [
    {
      email: 'ivanova@example.com',
      firstName: 'Анна',
      lastName: 'Иванова',
      bio: 'Клинический психолог с 15-летним опытом работы. Специализируюсь на когнитивно-поведенческой терапии и работе с тревожными расстройствами.',
      specialization: ['Клиническая психология', 'КПТ'],
      country: 'RU',
      city: 'Москва',
      phone: '+7 (999) 123-45-67',
      website: 'https://ivanova-psy.ru',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces',
    },
    {
      email: 'petrov@example.com',
      firstName: 'Сергей',
      lastName: 'Петров',
      bio: 'Психотерапевт, специалист по семейной терапии и психодраме.',
      specialization: ['Семейная психология', 'Психодрама'],
      country: 'RU',
      city: 'Санкт-Петербург',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces',
    },
    {
      email: 'chen@example.com',
      firstName: 'Wei',
      lastName: 'Chen',
      bio: 'Psychologist specializing in cross-cultural psychology and mindfulness-based interventions.',
      specialization: ['Кросс-культурная психология', 'Майндфулнес'],
      country: 'CN',
      city: 'Shanghai',
      website: 'https://weichen-psy.com',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces',
    },
    {
      email: 'alimova@example.com',
      firstName: 'Зухра',
      lastName: 'Алимова',
      bio: 'Детский психолог и нейропсихолог. Работаю с детьми с ОВЗ и их семьями.',
      specialization: ['Детская психология', 'Нейропсихология'],
      country: 'UZ',
      city: 'Ташкент',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=faces',
    },
    {
      email: 'nazarov@example.com',
      firstName: 'Азиз',
      lastName: 'Назаров',
      bio: 'Психолог-консультант, специалист по работе с зависимостями.',
      specialization: ['Консультирование', 'Зависимости'],
      country: 'KZ',
      city: 'Алматы',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces',
    },
  ]

  for (const m of members) {
    const password = await bcrypt.hash('member123', 10)
    await prisma.user.upsert({
      where: { email: m.email },
      update: {},
      create: {
        email: m.email,
        password,
        role: 'MEMBER',
        member: {
          create: {
            firstName: m.firstName,
            lastName: m.lastName,
            bio: m.bio,
            specialization: JSON.stringify(m.specialization),
            country: m.country,
            city: (m as { city?: string }).city ?? null,
            phone: (m as { phone?: string }).phone ?? null,
            website: (m as { website?: string }).website ?? null,
            photo: (m as { photo?: string }).photo ?? null,
            isPublic: true,
          },
        },
      },
    })
    console.log('Member created:', m.email)
  }

  // Events
  const events = [
    {
      slug: 'webinar-cbt-anxiety-2026',
      titleRu: 'Вебинар: КПТ при тревожных расстройствах',
      titleEn: 'Webinar: CBT for Anxiety Disorders',
      descriptionRu: 'Практический вебинар для психологов и психотерапевтов о применении когнитивно-поведенческой терапии при работе с тревожными расстройствами. Рассмотрим современные протоколы лечения, практические техники и разборы случаев.',
      descriptionEn: 'A practical webinar for psychologists and psychotherapists on applying CBT for anxiety disorders. We will cover modern treatment protocols, practical techniques, and case studies.',
      date: new Date('2026-04-15T14:00:00Z'),
      isOnline: true,
      maxSeats: 50,
      published: true,
    },
    {
      slug: 'conference-asian-psychology-2026',
      titleRu: 'IV Международная конференция по азиатской психологии',
      titleEn: 'IV International Conference on Asian Psychology',
      descriptionRu: 'Ежегодная конференция Азиатской Федерации Психологов, объединяющая специалистов из более чем 10 стран. Темы: кросс-культурные исследования, традиционные подходы в современной психотерапии, психическое здоровье в Азии.',
      descriptionEn: 'Annual conference of the Asian Federation of Psychologists, bringing together specialists from more than 10 countries. Topics: cross-cultural research, traditional approaches in modern psychotherapy, mental health in Asia.',
      date: new Date('2026-06-20T09:00:00Z'),
      location: 'Москва, Россия',
      isOnline: false,
      maxSeats: 200,
      published: true,
    },
    {
      slug: 'workshop-family-therapy-2026',
      titleRu: 'Воркшоп: Современные методы семейной терапии',
      titleEn: 'Workshop: Modern Family Therapy Methods',
      descriptionRu: 'Практический воркшоп по системной семейной терапии. Участники освоят техники работы с семьями в кризисных ситуациях, методы работы с конфликтами и нарушениями коммуникации.',
      descriptionEn: null,
      date: new Date('2026-05-10T10:00:00Z'),
      isOnline: true,
      maxSeats: 30,
      published: true,
    },
  ]

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: event,
    })
    console.log('Event created:', event.slug)
  }

  // News
  const newsItems = [
    {
      slug: 'afp-joins-world-council-psychotherapy',
      titleRu: 'АФП вступила во Всемирный совет по психотерапии',
      titleEn: 'AFP Joins the World Council for Psychotherapy',
      contentRu: 'Азиатская Федерация Психологов официально стала членом Всемирного совета по психотерапии (WCP). Это важный шаг в развитии международного сотрудничества и повышении стандартов психологической помощи в Азии.\n\nЧленство в WCP открывает новые возможности для профессионального развития наших членов, участия в международных конференциях и исследовательских проектах.',
      contentEn: 'The Asian Federation of Psychologists has officially become a member of the World Council for Psychotherapy (WCP). This is an important step in developing international cooperation and raising standards of psychological assistance in Asia.',
      coverImage: '/news/conference.jpg',
      published: true,
    },
    {
      slug: 'new-member-catalog-launched',
      titleRu: 'Запущен новый каталог специалистов АФП',
      titleEn: 'New AFP Specialist Catalog Launched',
      contentRu: 'Мы рады сообщить о запуске обновлённого каталога специалистов на нашем сайте. Теперь пользователи могут легко находить психологов и психотерапевтов по стране, городу и специализации.\n\nКаталог содержит профили специалистов из России, Казахстана, Узбекистана, Китая и других стран Азии.',
      contentEn: 'We are pleased to announce the launch of an updated specialist catalog on our website. Users can now easily find psychologists and psychotherapists by country, city, and specialization.',
      coverImage: '/news/catalog.jpg',
      published: true,
    },
    {
      slug: 'mental-health-awareness-month',
      titleRu: 'Месяц психического здоровья: мероприятия АФП',
      titleEn: 'Mental Health Awareness Month: AFP Events',
      contentRu: 'В октябре — Месяце психического здоровья — Азиатская Федерация Психологов проведёт серию бесплатных вебинаров и открытых лекций для широкой публики.\n\nМероприятия пройдут на русском и английском языках и будут доступны онлайн для всех желающих.',
      contentEn: 'In October — Mental Health Awareness Month — the Asian Federation of Psychologists will hold a series of free webinars and open lectures for the general public.',
      coverImage: '/news/mental-health.jpg',
      published: true,
    },
  ]

  for (const news of newsItems) {
    await prisma.news.upsert({
      where: { slug: news.slug },
      update: { coverImage: news.coverImage },
      create: news,
    })
    console.log('News created:', news.slug)
  }

  // Articles
  const articles = [
    {
      slug: 'cross-cultural-psychology-asia',
      titleRu: 'Кросс-культурная психология в Азии: вызовы и перспективы',
      titleEn: 'Cross-Cultural Psychology in Asia: Challenges and Prospects',
      contentRu: '## Введение\n\nКросс-культурная психология изучает влияние культурных факторов на психологические процессы и поведение человека. В контексте Азии эта дисциплина приобретает особое значение, учитывая колоссальное культурное разнообразие региона.\n\n## Основные вызовы\n\nОдним из ключевых вызовов является необходимость адаптации западных психологических теорий и инструментов к незападным культурным контекстам.',
      contentEn: '## Introduction\n\nCross-cultural psychology studies the influence of cultural factors on psychological processes and human behavior. In the Asian context, this discipline takes on special significance given the enormous cultural diversity of the region.',
      country: 'RU',
      tags: JSON.stringify(['кросс-культурная', 'Азия', 'исследования']),
      authorName: 'Проф. А.В. Смирнова',
      published: true,
    },
    {
      slug: 'mindfulness-eastern-traditions',
      titleRu: 'Майндфулнес и восточные традиции: интеграция в современную психотерапию',
      titleEn: 'Mindfulness and Eastern Traditions: Integration into Modern Psychotherapy',
      contentRu: '## Истоки практики\n\nПрактики осознанности имеют глубокие корни в буддийских, даосских и других восточных духовных традициях. На протяжении тысячелетий они использовались как инструмент трансформации сознания и достижения психологического благополучия.',
      contentEn: '## Origins of Practice\n\nMindfulness practices have deep roots in Buddhist, Taoist, and other Eastern spiritual traditions. For millennia, they have been used as tools for transforming consciousness and achieving psychological well-being.',
      country: 'RU',
      tags: JSON.stringify(['майндфулнес', 'восточные традиции', 'психотерапия']),
      authorName: 'К.п.н. В.М. Козлов',
      published: true,
    },
  ]

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    })
    console.log('Article created:', article.slug)
  }

  console.log('\nSeeding completed!')
  console.log('Admin login: admin@asianpsyche.org / admin123')
  console.log('Member login: ivanova@example.com / member123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
