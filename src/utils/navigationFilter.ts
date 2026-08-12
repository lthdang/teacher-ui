import type { NavItem, NavSection, CurrentUserContext } from '../types/navigation.types';

/**
 * Kiếm tra xem user context hiện tại có quyền truy cập item hay không.
 */
export function hasNavItemAccess(item: NavItem, context: CurrentUserContext): boolean {
  // 1. Kiểm tra systemOnly: Nếu item chỉ dành cho systemRole mà user không phải isSystemRole -> false
  if (item.systemOnly && !context.isSystemRole) {
    return false;
  }

  // 2. Kiểm tra permissions (OR logic): Nếu item khai báo permissions, chỉ cần 1 trong các permission = true
  if (item.permissions && item.permissions.length > 0) {
    const hasAnyPermission = item.permissions.some(
      (perm) => context.permissions[perm] === true
    );
    if (!hasAnyPermission) {
      return false;
    }
  }

  return true;
}

/**
 * Lọc danh sách NavItem dựa theo CurrentUserContext (bao gồm lọc đệ quy menu con).
 */
export function filterNavItems(items: NavItem[], context: CurrentUserContext): NavItem[] {
  return items.reduce<NavItem[]>((acc, item) => {
    // Kiếm tra quyền bản thân item
    const passesSelf = hasNavItemAccess(item, context);
    if (!passesSelf) {
      return acc;
    }

    // Nếu item có menu con, thực hiện lọc đệ quy
    let filteredChildren: NavItem[] | undefined = undefined;
    if (item.children && item.children.length > 0) {
      filteredChildren = filterNavItems(item.children, context);
    }

    // Nếu item không có route path trực tiếp và toàn bộ menu con bị ẩn -> không hiển thị item cha này
    if (!item.path && item.children && (!filteredChildren || filteredChildren.length === 0)) {
      return acc;
    }

    acc.push({
      ...item,
      children: filteredChildren,
    });

    return acc;
  }, []);
}

/**
 * Lọc toàn bộ danh sách NavSection. Bỏ các section không còn item nào sau khi lọc.
 */
export function filterNavSections(
  sections: NavSection[],
  context: CurrentUserContext
): NavSection[] {
  return sections.reduce<NavSection[]>((acc, section) => {
    const visibleItems = filterNavItems(section.items, context);
    if (visibleItems.length > 0) {
      acc.push({
        ...section,
        items: visibleItems,
      });
    }
    return acc;
  }, []);
}

/**
 * User Context mặc định dành cho Back Office Admin khi phát triển / fallback.
 * Mặc định cho phép hiển thị đầy đủ để testing & dev.
 */
export const defaultUserContext: CurrentUserContext = {
  userId: 'admin-01',
  tenantId: null,
  isSystemRole: true,
  permissions: {
    'teacher.view': true,
    'department.manage': true,
    'department.view': true,
    'user.view': true,
    'user.manage': true,
    'role.manage': true,
    'user_role.manage': true,
    'career_rank.manage': true,
    'career_rank.view': true,
    'report.view': true,
  },
};
