import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { seedDatabase } from "./seed.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-5855fea6/health", (c) => {
  return c.json({ status: "ok" });
});

// Seed endpoint pour initialiser la base de données
app.post("/make-server-5855fea6/seed", async (c) => {
  try {
    const result = await seedDatabase();
    return c.json(result);
  } catch (error) {
    console.error('Error seeding database:', error);
    return c.json({ error: 'Failed to seed database', details: error.message }, 500);
  }
});

// ==================== CODES ENDPOINTS ====================

// GET all codes
app.get("/make-server-5855fea6/codes", async (c) => {
  try {
    const category = c.req.query('category');
    const search = c.req.query('search');
    const sortBy = c.req.query('sortBy') || 'recent';
    const showExpired = c.req.query('showExpired') === 'true';

    // Récupérer tous les codes
    const codesData = await kv.getByPrefix("code:");
    let codes = codesData.map(item => item.value).filter(Boolean); // Filtrer les valeurs undefined/null

    // Filtrer par catégorie
    if (category && category !== 'ALL') {
      codes = codes.filter(code => code.category === category);
    }

    // Filtrer par recherche
    if (search) {
      const searchLower = search.toLowerCase();
      codes = codes.filter(code =>
        code.title.toLowerCase().includes(searchLower) ||
        code.description.toLowerCase().includes(searchLower) ||
        code.provider.toLowerCase().includes(searchLower)
      );
    }

    // Filtrer les codes expirés
    if (!showExpired) {
      const now = new Date().toISOString();
      codes = codes.filter(code => 
        !code.expiry_date || code.expiry_date >= now
      );
    }

    // Ajouter les ratings moyens et les infos utilisateur
    for (const code of codes) {
      // Récupérer les ratings pour ce code
      const ratingsData = await kv.getByPrefix(`rating:${code.id}:`);
      const ratings = ratingsData.map(item => item.value).filter(Boolean);
      
      code.rating_count = ratings.length;
      code.average_rating = ratings.length > 0
        ? ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length
        : 0;

      // Récupérer l'info utilisateur
      if (code.user_id) {
        const userData = await kv.get(`profile:${code.user_id}`);
        if (userData) {
          code.user = {
            username: userData.username,
            avatar_url: userData.avatar_url
          };
        }
      }
    }

    // Trier
    switch (sortBy) {
      case 'recent':
        codes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'popular':
        codes.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'top-rated':
        codes.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
        break;
      case 'expiring':
        codes.sort((a, b) => {
          if (!a.expiry_date) return 1;
          if (!b.expiry_date) return -1;
          return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
        });
        break;
    }

    return c.json(codes);
  } catch (error) {
    console.error('Error fetching codes:', error);
    return c.json({ error: 'Failed to fetch codes', details: error.message }, 500);
  }
});

// GET single code
app.get("/make-server-5855fea6/codes/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const code = await kv.get(`code:${id}`);

    if (!code) {
      return c.json({ error: 'Code not found' }, 404);
    }

    // Récupérer les ratings
    const ratingsData = await kv.getByPrefix(`rating:${id}:`);
    const ratings = ratingsData.map(item => item.value).filter(Boolean);
    
    code.rating_count = ratings.length;
    code.average_rating = ratings.length > 0
      ? ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length
      : 0;

    // Récupérer l'info utilisateur
    if (code.user_id) {
      const userData = await kv.get(`profile:${code.user_id}`);
      if (userData) {
        code.user = {
          username: userData.username,
          avatar_url: userData.avatar_url
        };
      }
    }

    return c.json(code);
  } catch (error) {
    console.error('Error fetching code:', error);
    return c.json({ error: 'Failed to fetch code', details: error.message }, 500);
  }
});

// POST new code
app.post("/make-server-5855fea6/codes", async (c) => {
  try {
    const body = await c.req.json();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newCode = {
      id,
      title: body.title,
      description: body.description,
      code: body.code,
      category: body.category,
      provider: body.provider,
      discount: body.discount,
      expiry_date: body.expiry_date || null,
      user_id: body.user_id,
      views: 0,
      copies: 0,
      confirmations: 0,
      created_at: new Date().toISOString(),
    };

    await kv.set(`code:${id}`, newCode);
    return c.json(newCode, 201);
  } catch (error) {
    console.error('Error creating code:', error);
    return c.json({ error: 'Failed to create code', details: error.message }, 500);
  }
});

// POST increment views
app.post("/make-server-5855fea6/codes/:id/view", async (c) => {
  try {
    const id = c.req.param('id');
    const code = await kv.get(`code:${id}`);

    if (!code) {
      return c.json({ error: 'Code not found' }, 404);
    }

    code.views = (code.views || 0) + 1;
    await kv.set(`code:${id}`, code);

    return c.json({ success: true, views: code.views });
  } catch (error) {
    console.error('Error incrementing views:', error);
    return c.json({ error: 'Failed to increment views', details: error.message }, 500);
  }
});

// POST increment copies
app.post("/make-server-5855fea6/codes/:id/copy", async (c) => {
  try {
    const id = c.req.param('id');
    const code = await kv.get(`code:${id}`);

    if (!code) {
      return c.json({ error: 'Code not found' }, 404);
    }

    code.copies = (code.copies || 0) + 1;
    await kv.set(`code:${id}`, code);

    return c.json({ success: true, copies: code.copies });
  } catch (error) {
    console.error('Error incrementing copies:', error);
    return c.json({ error: 'Failed to increment copies', details: error.message }, 500);
  }
});

// POST increment confirmations
app.post("/make-server-5855fea6/codes/:id/confirm", async (c) => {
  try {
    const id = c.req.param('id');
    const code = await kv.get(`code:${id}`);

    if (!code) {
      return c.json({ error: 'Code not found' }, 404);
    }

    code.confirmations = (code.confirmations || 0) + 1;
    await kv.set(`code:${id}`, code);

    return c.json({ success: true, confirmations: code.confirmations });
  } catch (error) {
    console.error('Error incrementing confirmations:', error);
    return c.json({ error: 'Failed to increment confirmations', details: error.message }, 500);
  }
});

// ==================== RATINGS ENDPOINTS ====================

// GET ratings for a code
app.get("/make-server-5855fea6/ratings/:codeId", async (c) => {
  try {
    const codeId = c.req.param('codeId');
    const ratingsData = await kv.getByPrefix(`rating:${codeId}:`);
    let ratings = ratingsData.map(item => item.value).filter(Boolean);

    // Ajouter les infos utilisateur
    for (const rating of ratings) {
      if (rating.user_id) {
        const userData = await kv.get(`profile:${rating.user_id}`);
        if (userData) {
          rating.user = {
            username: userData.username,
            avatar_url: userData.avatar_url
          };
        }
      }
    }

    // Trier par date décroissante
    ratings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return c.json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return c.json({ error: 'Failed to fetch ratings', details: error.message }, 500);
  }
});

// POST new rating
app.post("/make-server-5855fea6/ratings", async (c) => {
  try {
    const body = await c.req.json();
    const { code_id, user_id, rating, comment } = body;

    const newRating = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      code_id,
      user_id,
      rating,
      comment: comment || null,
      created_at: new Date().toISOString(),
    };

    await kv.set(`rating:${code_id}:${user_id}`, newRating);
    return c.json(newRating, 201);
  } catch (error) {
    console.error('Error creating rating:', error);
    return c.json({ error: 'Failed to create rating', details: error.message }, 500);
  }
});

// ==================== PROFILES ENDPOINTS ====================

// GET user profile
app.get("/make-server-5855fea6/profiles/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const profile = await kv.get(`profile:${userId}`);

    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return c.json({ error: 'Failed to fetch profile', details: error.message }, 500);
  }
});

// POST/PUT create or update profile
app.post("/make-server-5855fea6/profiles", async (c) => {
  try {
    const body = await c.req.json();
    const { id, username, email, avatar_url } = body;

    const profile = {
      id,
      username,
      email,
      avatar_url: avatar_url || null,
      created_at: new Date().toISOString(),
    };

    await kv.set(`profile:${id}`, profile);
    return c.json(profile, 201);
  } catch (error) {
    console.error('Error creating/updating profile:', error);
    return c.json({ error: 'Failed to create/update profile', details: error.message }, 500);
  }
});

// GET user stats
app.get("/make-server-5855fea6/stats/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    
    // Récupérer tous les codes de l'utilisateur
    const allCodesData = await kv.getByPrefix("code:");
    const userCodes = allCodesData
      .map(item => item.value)
      .filter(Boolean)
      .filter(code => code.user_id === userId);

    const stats = {
      total_codes: userCodes.length,
      total_views: userCodes.reduce((acc, code) => acc + (code.views || 0), 0),
      total_copies: userCodes.reduce((acc, code) => acc + (code.copies || 0), 0),
      total_confirmations: userCodes.reduce((acc, code) => acc + (code.confirmations || 0), 0),
    };

    return c.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return c.json({ error: 'Failed to fetch stats', details: error.message }, 500);
  }
});

Deno.serve(app.fetch);