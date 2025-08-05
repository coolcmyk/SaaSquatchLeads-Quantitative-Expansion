import { NextResponse } from 'next/server';
import { EnrichmentService } from '@/lib/services/enrichment-service';

export async function POST(request: Request) {
  try {
    const { company, website } = await request.json();
    const enrichmentService = new EnrichmentService();
    const data = await enrichmentService.enrichCompany({ company, website });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Enrichment failed' }, { status: 500 });
  }
}
