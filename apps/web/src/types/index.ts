export interface Certificate {
  id: number;
  studentName: string;
  degreeName: string;
  status: 'PENDING' | 'ISSUED' | 'REVOKED';
  ipfsCID: string | null;
  createdAt: string;
}