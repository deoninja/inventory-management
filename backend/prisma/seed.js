"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma = new prisma_1.PrismaClient();
async function deleteAllData(orderedFileNames) {
    const modelNames = orderedFileNames.map((fileName) => {
        const modelName = path_1.default.basename(fileName, path_1.default.extname(fileName));
        return modelName.charAt(0).toUpperCase() + modelName.slice(1);
    });
    for (const modelName of modelNames) {
        const model = prisma[modelName];
        if (model) {
            await model.deleteMany({});
            console.log(`Cleared data from ${modelName}`);
        }
        else {
            console.error(`Model ${modelName} not found. Please ensure the model name is correctly specified.`);
        }
    }
}
async function main() {
    const dataDirectory = path_1.default.join(__dirname, "seedData");
    const orderedFileNamesForSeeding = [
        "users.json",
        "expenses.json",
        "salesSummary.json",
        "purchaseSummary.json",
        "products.json",
        "expenseSummary.json",
        "sales.json",
        "purchases.json",
        "expenseByCategory.json",
    ];
    // Delete in reverse order of creation to respect foreign key constraints
    const orderedFileNamesForDeletion = [...orderedFileNamesForSeeding].reverse();
    await deleteAllData(orderedFileNamesForDeletion);
    for (const fileName of orderedFileNamesForSeeding) {
        const filePath = path_1.default.join(dataDirectory, fileName);
        const jsonData = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
        const modelName = path_1.default.basename(fileName, path_1.default.extname(fileName));
        const model = prisma[modelName];
        if (!model) {
            console.error(`No Prisma model matches the file name: ${fileName}`);
            continue;
        }
        for (const data of jsonData) {
            await model.create({
                data,
            });
        }
        console.log(`Seeded ${modelName} with data from ${fileName}`);
    }
}
main()
    .catch((e) => {
    console.error(e);
})
    .finally(async () => {
    await prisma.$disconnect();
});
