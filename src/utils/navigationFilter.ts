import type { NavItem, NavSection, CurrentUserContext } from '../types/navigation.types';

export function hasNavItemAccess(item: NavItem, context: CurrentUserContext): boolean {
  if (context.isSuperAdmin) {
    return true;
  }


  if (item.superAdminOnly) {
    return false;
  }

  if (item.systemOnly && !context.isSystemRole) {
    return false;
  }

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

export function filterNavItems(items: NavItem[], context: CurrentUserContext): NavItem[] {
  return items.reduce<NavItem[]>((acc, item) => {
    const passesSelf = hasNavItemAccess(item, context);
    if (!passesSelf) {
      return acc;
    }

    let filteredChildren: NavItem[] | undefined = undefined;
    if (item.children && item.children.length > 0) {
      filteredChildren = filterNavItems(item.children, context);
    }

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

export const defaultUserContext: CurrentUserContext = {
  userId: 'admin-01',
  tenantId: null,
  isSystemRole: true,
  isSuperAdmin: true,
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
