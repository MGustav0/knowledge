module.exports = {
    /**Para deixar as consultas mais específicas aqui */
    /** estamos passando em id (linha 14 -> "?") o id da categoria (categoryId) da função getByCategory 
     * na "const" categories, que obteve nos parâmetros da requisição (const categoryId) 
     * sendo passado na "?". 
     * É necessário usar aspas duplas quando o nome é case sensitive (parentId).
     * O parentId da categoria deve ser igual ao id da subcategoria, para encontrar o pai com os filhos.
     * Isso gerou, de forma recursiva, uma tabela temporária dentro da consulta que retornará o id
     * da própria categoria passada como parâmetro, depois fazendo uma união com a consulta selecionando
     * o id das subcategorias, fazendo um join com a tabela de categorias no qual o parentId vai ser a
     * subcategoria.id. O parentId vem de categories */
    categoryWithChildren: `
        WITH RECURSIVE subcategories (id) AS (
            SELECT id FROM categories WHERE id = ?
            UNION ALL
            SELECT c.id FROM subcategories, categories c
                WHERE "parentId" = subcategories.id
        )
        SELECT id FROM subcategories
    `
}