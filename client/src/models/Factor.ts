export class Factor {
    constructor(factorObject?: Partial<Factor>) {
        this.id = factorObject?.id;
        this.name = factorObject?.name || '';
        this.opposite_name = factorObject?.opposite_name || '';
        this.description = factorObject?.description || '';
        this.score = factorObject?.score || 0;
    }

    id?: number;
    name?: string;
    opposite_name?: string;
    description?: string;
    score?: number;
}