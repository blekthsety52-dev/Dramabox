import { Drama } from '../types/drama';

export const INITIAL_DRAMAS: Drama[] = [
  {
    id: 'secret-billionaire-heir',
    title: 'The Secret Billionaire Heir',
    originalTitle: 'Hidden Tycoon',
    coverImage: '/src/assets/images/poster_secret_billionaire_1790931972554.jpg',
    category: 'Billionaire',
    tags: ['Billionaire', 'Secret Identity', 'Revenge', 'Romance', 'CEO'],
    totalEpisodes: 82,
    rating: 9.9,
    views: '24.8M',
    synopsis: 'Disguised as an ordinary security guard for three years to fulfill his grandfather’s oath, Nathan Vance finally completes his test. When his haughty fiancée publicly dumps him for an arrogant heir, Nathan’s real butler arrives with the deed to the city’s largest conglomerate.',
    cast: ['Alexander Stone', 'Sophia Vance', 'Liam Sterling'],
    releaseYear: 2026,
    status: 'Completed',
    isTrending: true,
    rank: 1,
    likesCount: 184200,
    sharesCount: 39100,
    isFavorite: true,
    episodes: [
      {
        id: 101,
        episodeNumber: 1,
        title: 'The Humble Janitor’s Humiliation',
        duration: 95,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-the-phone-in-the-city-40742-large.mp4',
        isLocked: false,
        subtitles: {
          en: [
            { id: 1, start: 1, end: 4, text: "You're just a security guard, Nathan. We live in two different worlds." },
            { id: 2, start: 5, end: 9, text: "Three years... and you never believed in who I was." },
            { id: 3, start: 10, end: 15, text: "Sign this divorce agreement now. Mr. Sterling is waiting for me downstairs." },
            { id: 4, start: 16, end: 22, text: "Fine. When you walk out that door, don't ever beg to return." }
          ],
          es: [
            { id: 1, start: 1, end: 4, text: "Solo eres un guardia, Nathan. Vivimos en mundos diferentes." },
            { id: 2, start: 5, end: 9, text: "Tres años... y nunca creíste en quién era." },
            { id: 3, start: 10, end: 15, text: "Firma este acuerdo ahora. El Sr. Sterling me espera." }
          ],
          zh: [
            { id: 1, start: 1, end: 4, text: "你不过是个保安，内森。我们注定是两个世界的人。" },
            { id: 2, start: 5, end: 9, text: "整整三年……你从没有真正相信过我。" },
            { id: 3, start: 10, end: 15, text: "赶紧签了离婚协议，斯特林少爷还在楼下等我。" }
          ]
        }
      },
      {
        id: 102,
        episodeNumber: 2,
        title: 'The Butler’s Sudden Arrival',
        duration: 108,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-neon-light-41554-large.mp4',
        isLocked: false,
        subtitles: {
          en: [
            { id: 1, start: 1, end: 5, text: "Young Master Vance! The three-year period of seclusion has ended!" },
            { id: 2, start: 6, end: 11, text: "Grandfather sent ten black Rolls-Royces to escort you back." },
            { id: 3, start: 12, end: 18, text: "Tell the board of Global Apex Capital that their chairman has returned." }
          ],
          es: [
            { id: 1, start: 1, end: 5, text: "¡Joven maestro Vance! ¡El retiro de tres años ha concluido!" },
            { id: 2, start: 6, end: 11, text: "Su abuelo envió la flota para escoltarlo a la sede." }
          ],
          zh: [
            { id: 1, start: 1, end: 5, text: "大少爷！三年隐忍之期已满！" },
            { id: 2, start: 6, end: 11, text: "老太爷派十辆劳斯莱斯恭迎少爷重掌万盛资本！" }
          ]
        }
      },
      {
        id: 103,
        episodeNumber: 3,
        title: 'The Banquet Crash',
        duration: 112,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-the-rain-43093-large.mp4',
        isLocked: false,
        subtitles: {
          en: [
            { id: 1, start: 1, end: 6, text: "Who let this pauper into the summit of the elite?" },
            { id: 2, start: 7, end: 13, text: "He didn't sneak in. He owns the hotel!" }
          ],
          es: [
            { id: 1, start: 1, end: 6, text: "¿Quién dejó entrar a este mendigo a la cumbre de negocios?" },
            { id: 2, start: 7, end: 13, text: "¡Él no se coló! ¡Él es el dueño de la torre!" }
          ],
          zh: [
            { id: 1, start: 1, end: 6, text: "是谁把这个穷保安放进高端峰会的？" },
            { id: 2, start: 7, end: 13, text: "他不需要请柬，整个峰会酒店都是他的私人产业！" }
          ]
        }
      },
      {
        id: 104,
        episodeNumber: 4,
        title: 'Regret of the Ex-Fiancée',
        duration: 98,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-glass-of-red-wine-42861-large.mp4',
        isLocked: false,
        subtitles: {
          en: [
            { id: 1, start: 1, end: 5, text: "Nathan... is that really you sitting on the sovereign throne?" },
            { id: 2, start: 6, end: 12, text: "Miss Claire, please address him as Chairman Vance." }
          ],
          es: [
            { id: 1, start: 1, end: 5, text: "Nathan... ¿de verdad eres tú quien preside la mesa?" }
          ],
          zh: [
            { id: 1, start: 1, end: 5, text: "内森……坐在首席董事长位置上的，真的是你？！" }
          ]
        }
      },
      {
        id: 105,
        episodeNumber: 5,
        title: 'Slap to the Sterling Clan',
        duration: 120,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-woman-with-blue-neon-lights-42289-large.mp4',
        isLocked: true,
        requiredCoins: 10,
        subtitles: {
          en: [
            { id: 1, start: 1, end: 5, text: "Cancel every contract with the Sterling Group before sunrise." }
          ],
          es: [{ id: 1, start: 1, end: 5, text: "Cancelen todo contrato con los Sterling antes del amanecer." }],
          zh: [{ id: 1, start: 1, end: 5, text: "天亮之前，全面终止与斯特林家族的所有合作。" }]
        }
      },
      {
        id: 106,
        episodeNumber: 6,
        title: 'The Real Mistress of Vance Manor',
        duration: 110,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-walking-through-a-misty-forest-42880-large.mp4',
        isLocked: true,
        requiredCoins: 10
      },
      {
        id: 107,
        episodeNumber: 7,
        title: 'Ambush at Midnight Harbour',
        duration: 105,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-in-a-leather-jacket-in-front-of-a-sports-car-42200-large.mp4',
        isLocked: true,
        requiredCoins: 10
      }
    ],
    comments: [
      {
        id: 'c1',
        userName: 'Elena_R',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
        text: 'The look on her face when the Rolls-Royce convoy pulled up! Pure dopamine rush 🔥',
        likes: 1240,
        timestamp: '12m ago'
      },
      {
        id: 'c2',
        userName: 'DramaObsessed99',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        text: 'I told myself only 1 episode before sleep and here I am binge watching till episode 15 at 2am 😭',
        likes: 890,
        timestamp: '1h ago'
      },
      {
        id: 'c3',
        userName: 'Chloe Miller',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
        text: 'Nathan Vance is the ultimate revenge lead. Never underestimate a man carrying his family’s honor!',
        likes: 420,
        timestamp: '3h ago'
      }
    ]
  },
  {
    id: 'revenge-disowned-heiress',
    title: 'Revenge of the Disowned Heiress',
    originalTitle: 'Crown of Crimson',
    coverImage: '/src/assets/images/poster_revenge_heiress_1790931987261.jpg',
    category: 'Revenge',
    tags: ['Revenge', 'Strong Female Lead', 'High Society', 'Betrayal', 'Family Feud'],
    totalEpisodes: 76,
    rating: 9.8,
    views: '19.4M',
    synopsis: 'Framed by her devious step-sister and expelled from the wealthy Crawford dynasty in the freezing rain, Vivienne returns five years later under a mysterious identity with unlimited venture capital to systematically reclaim her mother’s company.',
    cast: ['Vivienne Laurent', 'Damian Blackwood', 'Cassandra Crawford'],
    releaseYear: 2026,
    status: 'Completed',
    isTrending: true,
    rank: 2,
    likesCount: 152900,
    sharesCount: 28400,
    isFavorite: false,
    episodes: [
      {
        id: 201,
        episodeNumber: 1,
        title: 'Cast into the Cold Rain',
        duration: 92,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-neon-light-41554-large.mp4',
        isLocked: false,
        subtitles: {
          en: [
            { id: 1, start: 1, end: 4, text: "You took my mother's heirloom and burned my father's testament." },
            { id: 2, start: 5, end: 9, text: "In this house, Vivienne, truth belongs to whoever holds the shares." },
            { id: 3, start: 10, end: 15, text: "Remember tonight. When I return, this mansion will be mine." }
          ],
          es: [
            { id: 1, start: 1, end: 4, text: "Te quedaste con la herencia de mi madre y quemaste el testamento." }
          ],
          zh: [
            { id: 1, start: 1, end: 4, text: "你抢走我母亲的遗物，毁掉我父亲的遗嘱。" },
            { id: 2, start: 5, end: 9, text: "在这座庄园里，股权即是真理，薇薇安。" }
          ]
        }
      },
      {
        id: 202,
        episodeNumber: 2,
        title: 'Queen of Wall Street Returns',
        duration: 104,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-woman-with-blue-neon-lights-42289-large.mp4',
        isLocked: false
      },
      {
        id: 203,
        episodeNumber: 3,
        title: 'The Hostile Takeover',
        duration: 115,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-glass-of-red-wine-42861-large.mp4',
        isLocked: false
      },
      {
        id: 204,
        episodeNumber: 4,
        title: 'Unmasking at the Gala',
        duration: 100,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-the-phone-in-the-city-40742-large.mp4',
        isLocked: true,
        requiredCoins: 10
      }
    ],
    comments: [
      {
        id: 'c21',
        userName: 'Sarah Jenkins',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
        text: 'The step-sister was crying real tears by episode 3!! Best revenge storyline of the year 💅',
        likes: 934,
        timestamp: '45m ago'
      },
      {
        id: 'c22',
        userName: 'Markus T',
        userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
        text: 'Vivienne is ruthless. That board room scene gave me chills.',
        likes: 512,
        timestamp: '2h ago'
      }
    ]
  },
  {
    id: 'alpha-destined-mate',
    title: 'Alpha’s Destined Mate',
    originalTitle: 'Silver Moon Luna',
    coverImage: '/src/assets/images/poster_alpha_mate_1790931999636.jpg',
    category: 'Werewolf',
    tags: ['Werewolf', 'Supernatural', 'Fated Mates', 'Alpha', 'Forbidden Romance'],
    totalEpisodes: 65,
    rating: 9.7,
    views: '16.7M',
    synopsis: 'Cast out as an omega with no wolf scent, Lyra is marked for exile. But during the blood moon ceremony, the most ruthless Alpha King of the Northern Pack detects her true royal scent and claims her before the entire elder council.',
    cast: ['Killian Cross', 'Lyra Moon', 'Garrett Drake'],
    releaseYear: 2026,
    status: 'Updating',
    isTrending: true,
    rank: 3,
    likesCount: 139400,
    sharesCount: 22100,
    isFavorite: false,
    episodes: [
      {
        id: 301,
        episodeNumber: 1,
        title: 'The Blood Moon Awakening',
        duration: 99,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-walking-through-a-misty-forest-42880-large.mp4',
        isLocked: false,
        subtitles: {
          en: [
            { id: 1, start: 1, end: 5, text: "Step forward, rogue. Bow before the Northern Council." },
            { id: 2, start: 6, end: 11, text: "Wait... that scent. She is not an outcast." },
            { id: 3, start: 12, end: 18, text: "She is my fated Luna. Touch her and face my wrath!" }
          ],
          es: [
            { id: 1, start: 1, end: 5, text: "Da un paso al frente, errante. Inclínate ante el Consejo." },
            { id: 2, start: 6, end: 11, text: "Ella es mi Luna predestinada." }
          ],
          zh: [
            { id: 1, start: 1, end: 5, text: "出列，流浪者。在北境议会面前低下头颅。" },
            { id: 2, start: 6, end: 11, text: "等等……这股气息。她不是弃徒，她是我的命定王后！" }
          ]
        }
      },
      {
        id: 302,
        episodeNumber: 2,
        title: 'The Silver Pack Collar',
        duration: 102,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-neon-light-41554-large.mp4',
        isLocked: false
      },
      {
        id: 303,
        episodeNumber: 3,
        title: 'Challenge of the Iron Alpha',
        duration: 118,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-the-rain-43093-large.mp4',
        isLocked: false
      }
    ],
    comments: [
      {
        id: 'c31',
        userName: 'WolfGirl2026',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
        text: 'Killian growling "MINE" during the ceremony was EVERYTHING! 🐺❤️',
        likes: 1850,
        timestamp: '30m ago'
      }
    ]
  },
  {
    id: 'return-god-of-war',
    title: 'Return of the God of War',
    originalTitle: 'Asura Unleashed',
    coverImage: '/src/assets/images/poster_god_of_war_1790932012844.jpg',
    category: 'Action',
    tags: ['Action', 'God of War', 'Urban Legend', 'Invincible', 'Justice'],
    totalEpisodes: 90,
    rating: 9.8,
    views: '22.1M',
    synopsis: 'Commander Brandon spent five years guarding the borders with a hundred thousand soldiers. Upon receiving news that his daughter is locked in a dog cage by local mobsters, he mobilizes the four battle generals and flies directly into the metropolis.',
    cast: ['Brandon Drake', 'General Vance', 'Lord Kenneth'],
    releaseYear: 2026,
    status: 'Completed',
    isTrending: false,
    rank: 4,
    likesCount: 172000,
    sharesCount: 31000,
    isFavorite: false,
    episodes: [
      {
        id: 401,
        episodeNumber: 1,
        title: 'The Distress Signal',
        duration: 90,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-in-a-leather-jacket-in-front-of-a-sports-car-42200-large.mp4',
        isLocked: false,
        subtitles: {
          en: [
            { id: 1, start: 1, end: 5, text: "Report, Commander! Your daughter is trapped in the southern province!" },
            { id: 2, start: 6, end: 12, text: "Assemble the Black Dragon regiment! We deploy immediately!" }
          ],
          es: [{ id: 1, start: 1, end: 5, text: "¡Informe, Comandante! ¡Su hija está en peligro!" }],
          zh: [{ id: 1, start: 1, end: 5, text: "报告战神！小公主在江城遇险！" }, { id: 2, start: 6, end: 12, text: "传令黑龙战旅，立刻集结！" }]
        }
      },
      {
        id: 402,
        episodeNumber: 2,
        title: 'Thunder in the City',
        duration: 105,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-the-rain-43093-large.mp4',
        isLocked: false
      }
    ],
    comments: [
      {
        id: 'c41',
        userName: 'ActionLover88',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        text: 'The entrance with the helicopter and the storm was peak cinema! ⚡',
        likes: 670,
        timestamp: '5h ago'
      }
    ]
  },
  {
    id: 'love-after-contract',
    title: 'Love After Contract',
    originalTitle: 'Paper Vows',
    coverImage: '/src/assets/images/poster_contract_marriage_1790932024765.jpg',
    category: 'Romance',
    tags: ['Contract Marriage', 'Enemies to Lovers', 'Sweet Romance', 'CEO', 'Co-living'],
    totalEpisodes: 58,
    rating: 9.6,
    views: '14.5M',
    synopsis: 'A one-year marriage on paper to satisfy both families. He thought she was a quiet, obedient wife, until he discovered she was the anonymous master chef and international fashion designer his company was desperately trying to sign.',
    cast: ['Julian Hayes', 'Aria Chen', 'Jessica Montgomery'],
    releaseYear: 2026,
    status: 'Completed',
    isTrending: false,
    rank: 5,
    likesCount: 118300,
    sharesCount: 19800,
    isFavorite: false,
    episodes: [
      {
        id: 501,
        episodeNumber: 1,
        title: 'The Rules of Our Marriage',
        duration: 94,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-the-phone-in-the-city-40742-large.mp4',
        isLocked: false,
        subtitles: {
          en: [
            { id: 1, start: 1, end: 5, text: "Clause 4: We do not interfere in each other's personal lives." },
            { id: 2, start: 6, end: 11, text: "Agreed, Mr. Hayes. Just make sure you don't fall in love first." }
          ],
          es: [{ id: 1, start: 1, end: 5, text: "Cláusula 4: No interferimos en la vida personal del otro." }],
          zh: [{ id: 1, start: 1, end: 5, text: "第四条协议：彼此绝不干涉私生活。" }]
        }
      },
      {
        id: 502,
        episodeNumber: 2,
        title: 'The Anonymous Designer',
        duration: 108,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-neon-light-41554-large.mp4',
        isLocked: false
      }
    ],
    comments: [
      {
        id: 'c51',
        userName: 'RomanceQueen',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
        text: 'The banter in episode 1 is so witty!! "Just make sure you don\'t fall in love first" haha! 😂',
        likes: 810,
        timestamp: '1d ago'
      }
    ]
  }
];

export const CATEGORIES = [
  'All',
  'Trending',
  'Billionaire',
  'Romance',
  'Werewolf',
  'Revenge',
  'Action'
] as const;

export const INITIAL_USER_STATE = {
  coins: 180,
  vipActive: false,
  vipDaysLeft: 0,
  dailyCheckInDone: false,
  checkInStreak: 4
};
