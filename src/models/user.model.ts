import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
    tableName: "users",
})
export default class User extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
    })
    id?: number;

    @Column({
        type: DataType.STRING(255),
        field: "email",
        unique: true,
        validate: {
            isEmail: true,
        },
        allowNull: false,
    })
    email?: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
        unique: true,
        validate: {
            isAlphanumeric: true,
        },
        field: "username"
    })
    username?: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        field: "password",
    })
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
