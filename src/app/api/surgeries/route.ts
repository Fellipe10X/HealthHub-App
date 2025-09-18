// src/app/api/surgeries/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { surgeryName, surgeryDate, surgeryDoctor, surgeryNotes } = await request.json();

    const newSurgery = await pool.query(
      'INSERT INTO surgeries (user_id, name, date, doctor, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, surgeryName, surgeryDate, surgeryDoctor, surgeryNotes]
    );

    return NextResponse.json(newSurgery.rows[0]);
  } catch (error) {
    console.error('Error saving surgery:', error);
    return NextResponse.json({ error: 'Error saving surgery' }, { status: 500 });
  }
}

export async function GET(request: Request) {
    const { userId } = auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const surgeries = await pool.query(
            'SELECT * FROM surgeries WHERE user_id = $1',
            [userId]
        );
        return NextResponse.json(surgeries.rows);
    } catch (error) {
        console.error('Error fetching surgeries:', error);
        return NextResponse.json({ error: 'Error fetching surgeries' }, { status: 500 });
    }
}