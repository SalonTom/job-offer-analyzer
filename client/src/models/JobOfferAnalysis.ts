import type { Factor } from "./Factor";

export class JobOfferAnalysis {
    constructor(factorObject?: Partial<JobOfferAnalysis>) {
        this.id = factorObject?.id;
        this.company = factorObject?.company || '';
        this.job_title = factorObject?.job_title|| '';
        this.url = factorObject?.url;
        this.comment = factorObject?.comment;
        this.note = factorObject?.note || 0;
        this.user_id = factorObject?.user_id;
        this.factors = factorObject?.factors ?? [];
    }

    id?: number;
    company: string;
    job_title: string;
    url?: string;
    comment?: string;
    note: number;
    user_id? : number;
    factors: Factor[];
}