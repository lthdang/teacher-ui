import type { LucideIcon } from 'lucide-react';

/**
 * Permission key format theo bảng `roles.permissions` (JSONB)
 * ví dụ: "teacher.view", "department.manage", "tenant.manage"
 */
export type PermissionKey = string;

export interface NavItem {
  /** id duy nhất, dùng làm React key + để lưu trạng thái mở/đóng group */
  id: string;
  /** Nhãn hiển thị (ưu tiên tiếng Việt vì admin nội bộ) */
  label: string;
  /** Nhãn tiếng Anh, dùng khi cần i18n */
  labelEn?: string;
  /** Icon từ lucide-react */
  icon: LucideIcon;
  /** Đường dẫn route, không set nếu item chỉ là group cha */
  path?: string;
  /**
   * Permission cần có để thấy item này.
   * - undefined: ai cũng thấy (ví dụ Dashboard)
   * - string[]: chỉ cần có 1 trong các quyền (OR)
   */
  permissions?: PermissionKey[];
  /** Chỉ hiện với role hệ thống (is_system_role = true), vd Dev/Super Admin quản lý Tenants */
  systemOnly?: boolean;
  /** Badge nhỏ hiển thị cạnh label, vd số lượng pending */
  badge?: string | number;
  /** Menu con */
  children?: NavItem[];
}

export interface NavSection {
  id: string;
  title?: string; // tiêu đề nhóm, vd "QUẢN LÝ TỔ CHỨC"
  items: NavItem[];
}

/** Thông tin tối thiểu về user hiện tại để lọc menu theo quyền */
export interface CurrentUserContext {
  userId: string;
  tenantId: string | null; // null nếu là Dev / Super Admin thao tác nhiều tenant
  isSystemRole: boolean;
  /** Gộp permissions từ tất cả role đang active tại tenant hiện tại */
  permissions: Record<PermissionKey, boolean>;
}
