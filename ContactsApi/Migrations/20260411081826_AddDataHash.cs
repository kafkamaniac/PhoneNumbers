using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ContactsApi.Migrations
{
    /// <inheritdoc />
    public partial class AddDataHash : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DataHash",
                table: "Contacts",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataHash",
                table: "Contacts");
        }
    }
}
