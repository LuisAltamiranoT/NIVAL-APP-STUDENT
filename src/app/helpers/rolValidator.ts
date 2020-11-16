import { User } from 'src/app/shared/user.interface';

export class RoleValidator {
    isAdmin(user: User): boolean {
        return user.role === 'ADMIN';
    }
}