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
        console.log("API /api/medications: Acesso bloqueado - Usuário não autenticado.");
        return new Response("Unauthorized", { status: 401 });
    }

    console.log(`API /api/medications: Recebida requisição do usuário ${userId}`);

    try {
        const medications = await pool.query(
            'SELECT * FROM medications WHERE user_id = $1',
            [userId]
        );
        console.log(`API /api/medications: Consulta ao banco de dados bem-sucedida. Encontrados ${medications.rows.length} registros.`);
        return NextResponse.json(medications.rows);
    } catch (error) {
        console.error('ERRO CRÍTICO na API /api/medications:', error);
        return NextResponse.json({ error: 'Erro interno no servidor ao buscar medicamentos' }, { status: 500 });
    }
}