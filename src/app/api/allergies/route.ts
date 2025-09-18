// src/app/api/allergies/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { allergyName, allergySeverity, allergySymptoms } = await request.json();

    const newAllergy = await pool.query(
      'INSERT INTO allergies (user_id, name, severity, symptoms) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, allergyName, allergySeverity, allergySymptoms]
    );

    return NextResponse.json(newAllergy.rows[0]);
  } catch (error) {
    console.error('Error saving allergy:', error);
    return NextResponse.json({ error: 'Error saving allergy' }, { status: 500 });
  }
}

export async function GET(request: Request) {
    const { userId } = auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const allergies = await pool.query(
            'SELECT * FROM allergies WHERE user_id = $1',
            [userId]
        );
        return NextResponse.json(allergies.rows);
    } catch (error) {
        console.error('Error fetching allergies:', error);
        return NextResponse.json({ error: 'Error fetching allergies' }, { status: 500 });
    }
}