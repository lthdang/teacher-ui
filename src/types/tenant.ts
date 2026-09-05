export type SchoolLevel = 'primary' | 'secondary' | 'university';

export interface TenantSimple {
  id: string;
  name: string;
  slug: string;
  school_level?: SchoolLevel;
  schoolLevel?: SchoolLevel;
  province_code?: string | null;
  provinceCode?: string | null;
  is_active?: boolean;
  isActive?: boolean;
}

export interface TenantDetail {
  id: string;
  name: string;
  slug: string;
  school_level?: SchoolLevel;
  schoolLevel?: SchoolLevel;
  province_code?: string | null;
  provinceCode?: string | null;
  settings?: string | Record<string, any> | null;
  is_active?: boolean;
  isActive?: boolean;
  created_at?: string | null;
  createdAt?: string | null;
  updated_at?: string | null;
  updatedAt?: string | null;
}

export interface CreateTenantRequest {
  name: string;
  slug: string;
  school_level: SchoolLevel;
  province_code?: string;
  settings?: any;
  is_active?: boolean;
}

export interface UpdateTenantRequest {
  name?: string;
  slug?: string;
  school_level?: SchoolLevel;
  province_code?: string;
  settings?: any;
  is_active?: boolean;
}
