using System.Diagnostics;

public class BackupService
{
    public void CreateBackup(string userName, int version)
    {
        var folder = @"C:\Backups";

        if (!Directory.Exists(folder))
            Directory.CreateDirectory(folder);

        var date = DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss");
        var fileName = $"backup_v{version}_{userName}_{date}.sql";
        var fullPath = Path.Combine(folder, fileName);

        var process = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = @"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe",
                Arguments = "-h 127.0.0.1 -P 3306 -u root contactsdb --routines --triggers --single-transaction --quick",
                RedirectStandardOutput = true,
                UseShellExecute = false,
                CreateNoWindow = true
            }
        };

        process.Start();

        using (var writer = new StreamWriter(fullPath))
        {
            writer.Write(process.StandardOutput.ReadToEnd());
        }

        process.WaitForExit();
    }
}