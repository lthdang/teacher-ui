export interface RoleItem {
  id: string;
  code: string;
  name: string;
  hierarchyLevel: number;
  permissions?: string | Record<string, unknown> | null;
  isSystemRole?: boolean;
  description?: string | null;
  createdAt?: string | null;
  updateAt?: string | null;
}

export interface RoleSearchResponse {
  status: number;
  message: string;
  data: RoleItem[];
  page?: number;
  limit?: number;
  totalRecords?: number;
}

export interface CreateRoleRequest {
  code: string;
  name: string;
  hierarchyLevel: number;
  permissions?: unknown;
  isSystemRole?: boolean;
  description?: string;
}

export interface UpdateRoleRequest {
  name?: string;
  hierarchyLevel?: number;
  permissions?: unknown;
  description?: string;
}
