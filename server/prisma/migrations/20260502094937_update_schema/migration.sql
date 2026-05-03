/*
  Warnings:

  - You are about to drop the `AbsentPic` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `picturePath` to the `Absent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `AbsentPic` DROP FOREIGN KEY `AbsentPic_absentId_fkey`;

-- AlterTable
ALTER TABLE `Absent` ADD COLUMN `picturePath` VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE `AbsentPic`;
