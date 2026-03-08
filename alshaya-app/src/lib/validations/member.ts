import { z } from "zod";

export const createMemberSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  fatherName: z.string().optional(),
  grandfatherName: z.string().optional(),
  greatGrandfatherName: z.string().optional(),
  familyName: z.string().default("آل شايع"),
  fullNameAr: z.string().optional(),
  fullNameEn: z.string().optional(),
  gender: z.enum(["Male", "Female"]),
  birthYear: z.number().int().min(1400).max(2030).optional().nullable(),
  deathYear: z.number().int().min(1400).max(2030).optional().nullable(),
  status: z.enum(["Living", "Deceased"]).default("Living"),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  generation: z.number().int().min(1).max(20).optional(),
  branch: z.string().optional().nullable(),
  fatherId: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updateMemberSchema = createMemberSchema.partial();

export const searchMembersSchema = z.object({
  query: z.string().optional(),
  gender: z.enum(["Male", "Female"]).optional(),
  status: z.enum(["Living", "Deceased"]).optional(),
  generationMin: z.number().int().min(1).optional(),
  generationMax: z.number().int().max(20).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
export type SearchMembersInput = z.infer<typeof searchMembersSchema>;
