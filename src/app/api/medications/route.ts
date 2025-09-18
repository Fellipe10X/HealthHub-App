// src/app/api/medications/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { medName, medDosage, medFrequency, medNotes } = await request.json();

    const newMedication = await pool.query(
      'INSERT INTO medications (user_id, name, dosage, frequency, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, medName, medDosage, medFrequency, medNotes]
    );

    return NextResponse.json(newMedication.rows[0]);
  } catch (error) {
    console.error('Error saving medication:', error);
    return NextResponse.json({ error: 'Error saving medication' }, { status: 500 });
  }
}

export async function GET(request: Request) {
    const { userId } = auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const medications = await pool.query(
            'SELECT * FROM medications WHERE user_id = $1',
            [userId]
        );
        return NextResponse.json(medications.rows);
    } catch (error) {
        console.error('Error fetching medications:', error);
        return NextResponse.json({ error: 'Error fetching medications' }, { status: 500 });
    }
}