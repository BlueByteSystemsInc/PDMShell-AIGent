export interface DocChunk {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  category: string;
}

export const pdmshellDocs: DocChunk[] = [
  {
    id: "addtovault",
    title: "ADDTOVAULT Command",
    content: `The \`addtovault\` command is used to add files and/or directories to the PDM vault. It supports various parameters to specify the source files or directories, search queries, and additional options such as ignoring existing files, updating references, and recursive operations.

It is highly recommended that you run PDMShell as administrator before using this command.

SYNTAX:
addtovault -csv -dir -search -source -ignoreex -updaterefs -recursive

PARAMETERS:
- csv: (Optional) Specifies the path to a CSV file containing a list of files or directories to be added to the vault.
- directory: (Optional) Specifies the target directory. If not specified current directory is used. If using the current directory, use "".
- search: (Optional) A search query to filter files or directories to be added to the vault. This is File Explorer search query. Use * as a wildcard.
- source: Specifies the source file or directory to be added to the vault. Default to the current folder in PDM if not specified.
- ignoreex: (Optional) Ignores files that already exist in the vault. This prevents overwriting existing files.
- updaterefs: (Optional) Updates references for the files being added to the vault.
- recursive: (Optional) Adds all files and subdirectories within the specified directory.

EXAMPLES:
addtovault -source "C:\\Projects\\file.txt" -directory ""
# adds text file to the current directory

REMARKS:
- Use the recursive parameter with caution, as it will add all contents within the specified directory.
- The ignoreex parameter prevents overwriting files that already exist in the vault.
- Ensure you have the necessary permissions to add files or directories to the PDM vault.
- Files are left checked out after command completes.
- Use \`checkin -search % -recursive\` to check in all added files after calling addtovault.`,
    keywords: ["addtovault", "add", "vault", "import", "files", "directories", "csv", "source", "recursive", "ignoreex", "updaterefs", "upload", "bring in"],
    category: "file-management"
  },
  {
    id: "bom",
    title: "BOM Command",
    content: `The BOM command allows you to extract a Bill of Materials from a SOLIDWORKS file inside the PDM vault and export it to a CSV file. This command supports configuration evaluation using $configuration, allows specifying configNames, and supports selecting a layout from all available BOM layouts.

SYNTAX:
bom -filePath -name -directory -configNames -layout

PARAMETERS:
- filePath: Path to the SOLIDWORKS file whose BOM you want to export.
- name: The base name for the exported CSV file. Supports evaluation (e.g., $configuration).
- directory: Target folder where the CSV will be saved.
- configNames: Comma-separated list of configurations to extract the BOM from. If unspecified, all configurations are processed. Example: @,Default,Manufacturing.
- layout: A comma-separated list of BOM layout names to export. Example: Engineering,Manufacturing. PDMShell validates layout names against PDM before exporting.`,
    keywords: ["bom", "bill of materials", "export", "csv", "configuration", "layout", "assembly", "solidworks", "extract"],
    category: "export"
  },
  {
    id: "cd",
    title: "CD Command",
    content: `Changes the current PDM directory.

SYNTAX:
cd [-directory|-id]

PARAMETERS:
- directory (or d): The directory to switch to. The directory parameter can be a relative or absolute path in PDM.
- id: ID of the folder to navigate to.

EXAMPLES:
cd -directory 'C:\\Vault\\NewFolder'  # Navigates to NewFolder
cd..  # Navigates to the parent folder
cd\\  # Navigates to the root of the vault
cd api  # navigates to the api folder
cd -id 755  # navigates to the folder with id 755

REMARKS:
- If the user just created a new folder and wants to cd to it using autocomplete, they need to use the dir command with the -refresh parameter to force the session to load the current files and sub-folders in the active directory.
- directory is the default parameter. You do not need to specify it if it is the only parameter in your command.`,
    keywords: ["cd", "change directory", "navigate", "folder", "path", "directory", "move", "switch"],
    category: "navigation"
  },
  {
    id: "checkin",
    title: "CHECKIN Command",
    content: `Performs a check-in operation on a specified file or many files.

SYNTAX:
checkin -search -filePath -comment -Checkinoptions

PARAMETERS:
- search: The search operation to use.
- filePath: The file(s) to be checked in. This is the default parameter.
- comment: The comment to add to the check-in.
- Checkinoptions: The check-in options to use.

EXAMPLES:
checkin -filePath "file1.sldprt"

REMARKS:
- The search parameter searches the current directory and does not drill down. The search query is a PDM one, so you can use % for wildcard.
- If combining Checkinoptions parameters, the user needs to add + between the values.

Checkinoptions Parameter Values:
- EdmUnlock_FailOnRegenerationNeed: Fail if the file needs to be regenerated in the CAD program. NOTE: Only files resaved in SOLIDWORKS 2009 or later can trigger this flag.
- EdmUnlock_ForceUnlock: Unlock the file even if it is not modified.
- EdmUnlock_IgnoreCorruptFile: Ignore files with file formats unrecognized by SOLIDWORKS PDM Professional; without this flag, SOLIDWORKS PDM Professional returns E_EDM_INVALID_FILE if it encounters a corrupt file or a file containing a newer format than SOLIDWORKS PDM Professional can handle.
- EdmUnlock_IgnoreReferences: Silently unlock parent files without their references.
- EdmUnlock_IgnoreRefsNotLockedByCaller: Ignore references not locked by caller.
- EdmUnlock_IgnoreRefsOutsideVault: Ignore references to files outside the vault.
- EdmUnlock_KeepLocked: Keep the file checked out after creating the new version in the archive.
- EdmUnlock_OverwriteLatestVersion: Do not create a new version; overwrite the last version of the file with new changes.
- EdmUnlock_RemoveLocalCopy: Remove the local copy of the file from the hard disk after the file has been checked in.
- EdmUnlock_Simple: Check in the file using default behavior.`,
    keywords: ["checkin", "check in", "unlock", "commit", "save", "version", "comment", "checkinoptions"],
    category: "version-control"
  },
  {
    id: "checkout",
    title: "CHECKOUT Command",
    content: `Performs a check out operation on a specified file or many files.

SYNTAX:
checkout -search -recursive -filePath -checkoutoptions

PARAMETERS:
- search: Search keyword.
- filePath: The file(s) to be checked out. This is the default parameter.
- recursive: Recursively check out all files in the current directory. Use in combination with search.
- checkoutoptions: Optional. Use this to check a file and its references at once.

Checkout Options:
- Nothing: No checkout options are applied.
- AsBuilt1: Uses the same versions of referenced files that were used when the referencing file was checked in; otherwise, the latest versions are used.
- SkipUnlockedWritable: Does not retrieve files that are writable and not checked out.
- SkipExisting: Does not retrieve files that already exist in the local cache.
- ForPreview: Retrieves only referenced files required for preview; skips caching referenced files.
- RefreshFileListing: Refreshes the File Explorer listing after files have been checked out.
- LockReferencedFilesToo: Checks out (locks) files referenced by the checked-out file.
- AsBuiltNotDefault: Uses the as-built versions when creating the reference tree.
- SkipOpenFileChecks: Skips checking whether files are open in another application.
- SkipLockRefFiles: Skips checking of lock file references.
- LockNoLclCopyFiles: Locks referenced files even if no local cache copy exists.
- IncludeAutoCacheFiles: Automatically caches referenced files if the latest version is not already in the local cache.
- RollbackTree: Provides the ability to roll back files in the checkout dialog.
- ForViewer: Retrieves only referenced files required by the viewer; skips caching referenced files.
- SingleFileRollback: Rolls back a single file.
- XrefsOpenCheck: Checks whether cross-reference files are open in another application.

You combine values by using +. Wrap the parameter value in "". Example: "SkipExisting + LockReferencedFilesToo"

EXAMPLES:
checkout -filePath file1.sldprt

REMARKS:
- The search parameter searches the current directory and does not drill down. The search query is a PDM one, so you can use % for wildcard.`,
    keywords: ["checkout", "check out", "lock", "edit", "reserve", "checkoutoptions", "references"],
    category: "version-control"
  },
  {
    id: "clearcache",
    title: "CLEARCACHE Command",
    content: `Clears the local cache of a folder or many files.

SYNTAX:
clearcache -directory -search -toolboxflag -source

PARAMETERS:
- directory: The directory to clear the local cache of.
- search: Search query.
- toolboxflag: Ignore toolbox files.
- source: CSV files containing complete local file paths to clear. First row is header.

EXAMPLES:
clearcache -search "*.sldprt"
# Clears the cache of all .sldprt files in the current directory.

clearcache -directory project -toolboxflag
# Clears the directory called project while ignoring toolbox files.

clearcache -source "source.csv"
# Clears the cache for the specified source.`,
    keywords: ["clearcache", "clear cache", "cache", "local", "clean", "toolbox", "refresh"],
    category: "system"
  },
  {
    id: "cls",
    title: "CLS Command",
    content: `Clears the current session.

SYNTAX:
cls

PARAMETERS:
Command has no parameters.

REMARKS:
- You can alternatively set the Line Limit Count from the settings to remind the session to clear every count of lines.`,
    keywords: ["cls", "clear", "screen", "session", "reset"],
    category: "system"
  },
  {
    id: "copy",
    title: "COPY Command",
    content: `Performs a vault-to-vault copy operation in SOLIDWORKS PDM.

The copy command creates new files with new File IDs inside the vault by copying:
- A single file
- All files in a folder
- Files found using a search scoped to a source folder

This command does not add files from disk and does not modify the original files.

SYNTAX:
copy -source -directory -search -recursive -name -ignoreexisting

PARAMETERS:
- source: The source file or folder inside the vault. If a file path is provided (ends with an extension), only that file is copied. If a folder path is provided, all matching files in that folder are copied.
- directory: The destination folder inside the vault where files will be copied.
- search: Optional PDM search keyword used to filter files in the source folder. Supports % wildcards.
- recursive: Optional. When used with search, includes subfolders.
- name: Required. Specifies the destination file name. Alias expressions are evaluated only for the destination name. Extension required.
- ignoreexisting: Not implemented.

EXAMPLES:
copy -source part1.sldprt -directory /Vault/Projects/Released -name part2.sldprt
copy -source Vault/Projects/WIP -search %.slddrw -directory Vault/Projects/Released -name "$namewithouextension-new$extension"

REMARKS:
- If source is a file, search and recursive are ignored.
- If source is a folder and search is not provided, all files in that folder are copied.
- The search parameter does not search the entire vault, only the source folder.`,
    keywords: ["copy", "duplicate", "clone", "vault", "file id", "source", "destination"],
    category: "file-management"
  },
  {
    id: "copytree",
    title: "COPYTREE Command",
    content: `The copytree command is used to copy files and their associated metadata from a source directory or search results, with options to apply prefixes, suffixes, and other filters. This only works with assembly files.

SYNTAX:
copytree [-search|-filePath] -suffix -prefix -recursive -includedrawings -latest -directory

PARAMETERS:
- filePath: The source file or directory to copy.
- directory: Specifies the target directory where the files will be copied.
- search: A search query to filter files to be copied.
- suffix: Adds a suffix to the copied files.
- prefix: Adds a prefix to the copied files.
- recursive: Copies files recursively from subdirectories.
- includedrawings: Includes associated drawing files in the copy operation.
- latest: Ensures the latest version of the files is copied.

EXAMPLES:
copytree -filePath "fidget spinner.sldasm" -suffix _ -directory "\\new project"
copytree -search "*.sldasm" -includedrawings -directory "c:\\export"

REMARKS:
- The -dir parameter specifies the target directory. If omitted, the current directory is used.
- The -includedrawings parameter ensures that associated drawing files are included.
- The -latest parameter ensures that only the latest versions are copied.`,
    keywords: ["copytree", "copy tree", "assembly", "duplicate", "suffix", "prefix", "drawings", "metadata", "clone"],
    category: "file-management"
  },
  {
    id: "delete",
    title: "DELETE Command",
    content: `The delete command is used to delete files or directories from the PDM system. It supports various parameters to specify the target files or directories, including file paths, directory paths, search queries, and IDs. The command also supports recursive deletion for directories.

SYNTAX:
delete [-filePath|-id] -directory -search -recursive -list -csv

PARAMETERS:
- filePath: (Optional) Specifies the file path of the file to be deleted.
- directory: (Optional) Specifies the directory to be deleted. If used with -recursive, all files and subdirectories will also be deleted.
- search: (Optional) A search query to filter files or directories to be deleted.
- id: (Optional) Specifies the ID of the file to be deleted.
- recursive: (Optional) Deletes all files and subdirectories within the specified directory.
- list: (Optional) Lists all the deleted files. Specifying recursive with this parameter will do a drill down search.
- csv: Exports a list of deleted files to a csv. This only works if list is specified.
- destroy: If specified, the deleted file will be also destroyed.

EXAMPLES:
delete -search "%.sldprt"
# delete all parts in the current directory

REMARKS:
- The delete command requires at least one of: filePath, dir, search, or id.
- Use the recursive parameter with caution.
- Ensure you have the necessary permissions.
- Use the exported csv from -csv with the recover command.`,
    keywords: ["delete", "remove", "destroy", "files", "directories", "recursive", "list", "csv"],
    category: "file-management"
  },
  {
    id: "deletefromsource",
    title: "DELETEFROMSOURCE Command",
    content: `The deletefromsource function is used to delete files from a csv file.

SYNTAX:
deletefromsource -filePath

PARAMETERS:
- filePath: A string containing the IDs of the files and folders to be deleted. Must be a CSV file with a column header containing the IDs.
- destroy: If specified, the deleted file will be also destroyed.

REMARKS:
- The source file should be a CSV file with a column header containing the IDs of the files to be deleted.
- The command will ignore any files that are checked out.

EXAMPLES:
deletefromsource -filePath "files to delete.csv"`,
    keywords: ["deletefromsource", "delete", "csv", "batch", "bulk", "source"],
    category: "file-management"
  },
  {
    id: "destroy",
    title: "DESTROY Command",
    content: `The destroy command is used to permanently delete files that have been marked as deleted in a specified directory. This command supports recursive deletion and filtering by date.

SYNTAX:
destroy -directory -recursive -date

PARAMETERS:
- directory: The directory to destroy.
- recursive: Enables recursive search (for files).
- date: (Optional) Specifies a date filter. Only files deleted on or before the specified date will be destroyed. The date format should be YYYY-MM-DD.

EXAMPLES:
destroy -directory "C:\\Projects\\Project"
# destroys all deleted files in project folder

REMARKS:
- The directory parameter is mandatory and must specify a valid directory.
- Use the recursive parameter with caution.
- The date parameter allows you to target files deleted on or before the specified date.
- This action is irreversible. Ensure you have the necessary permissions.`,
    keywords: ["destroy", "permanent delete", "purge", "irreversible", "date filter", "remove permanently"],
    category: "file-management"
  },
  {
    id: "dir",
    title: "DIR Command",
    content: `Displays a list of files and subdirectories in a directory.

SYNTAX:
dir -sort -columns -csv -refresh -recursive

PARAMETERS:
- sort: The column name to sort the list of files and folders with.
- columns: The columns to display, separated by commas. These are PDM variables drawn from the @ tab.
- csv: Export the directory listing to a CSV file. Must include the csv extension.
- refresh: Refreshes the session to load the current files and sub-folders in the active directory in the autocomplete list.
- recursive: Lists all files and all folders in the current directory recursively.

EXAMPLES:
dir
dir -sort "name" -cols "description,partnumber" -csv "output.csv" -refresh

REMARKS:
- Use the -refresh parameter to force the session to load the current files and sub-folders. Do not use this when the current folder has many items.
- The CSV file will be checked into the current directory.`,
    keywords: ["dir", "list", "directory", "files", "folders", "columns", "csv", "sort", "refresh", "ls"],
    category: "navigation"
  },
  {
    id: "dump",
    title: "DUMP Command",
    content: `Dumps all session text into a log file and check it back into the vault.

SYNTAX:
dump filePath

PARAMETERS:
- filePath: The log file to dump session details into.

EXAMPLES:
dump -filePath "$release_script_$yyyy_$mm_$dd_$guid.txt"

REMARKS:
- To make sure your logs are always unique, use $guid or the date/time place holders.
- If you start PDMShell as a Windows administrator with the -winlog or /winlog parameter, PDMShell will create logs in the Windows event viewer.`,
    keywords: ["dump", "log", "session", "save", "output", "text", "winlog", "event viewer"],
    category: "system"
  },
  {
    id: "editvars",
    title: "EDITVARS Command",
    content: `Opens the PDM variable editor.

SYNTAX:
editvars

PARAMETERS:
None

EXAMPLES:
editvars
# open the PDM variable editor`,
    keywords: ["editvars", "edit variables", "variable editor", "data card", "manager"],
    category: "variables"
  },
  {
    id: "eval",
    title: "Dynamic Placeholders (EVAL)",
    content: `The Dynamic Placeholders feature in PDMShell allows you to substitute values dynamically using placeholders. This functionality is supported by several commands and enables the use of file or folder properties, system variables, and other contextual information to generate new values automatically.

Dynamic Placeholders are not a standalone command but a feature used by specific commands to process the value parameter or other relevant inputs.

Commands Supporting Dynamic Placeholders:

Commands Using the Current Folder as the Backing Object (directory parameter):
- cd: Change the current directory.
- mkdir: Create a new directory.
- export: Export commands to a file.
- addtovault: Add a vault with the directory as the backing object.

Commands Using Files or Folders as the Backing Object:
- rename: Uses the value parameter for renaming files or folders.
- renamefromsource: The new file is evaluated if the evaluatealiases parameter is specified.
- setvar: Uses the value parameter to set variables for files or folders.
- bom: Uses the name parameter to set the exported bom csv name.
- export: Uses the name parameter to set the exported files name pattern.

Placeholders for Files:
- $value: Existing value of the variable.
- $name: The file name with extension.
- $namewithoutextension: The file name without extension.
- $extension: The file extension.
- $id: The file ID.
- $revision: The current revision of the file.
- $version: The current version of the file.
- $fullyqualifiedname: The full local path of the file.
- $fullyqualifiedfoldername: The full local path of the folder containing the file.
- $foldername: The name of the folder containing the file.
- $configuration: Configuration name. Only valid for BOM command.

Placeholders for Folders:
- $value: Existing value of the variable.
- $name: The folder name.
- $foldername: The name of the parent folder.
- $id: The folder ID.
- $fullyqualifiedname: The full local path of the folder.

Common Placeholders (Both Files and Folders):
- $username: The name of the logged-in user.
- $vaultname: The name of the vault.
- $yyyy: The current year.
- $mm: The current month (two digits).
- $hh: The current hour (two digits).
- $mi: The current minute (two digits).
- $ss: The current second (two digits).
- $date: The current date.
- $time: The current time in the current locale.
- $guid: Unique identifier.

Using Variables in Dynamic Placeholders:
You can include other variables by enclosing them in square brackets (e.g., [VariableName]). These variables are dynamically resolved based on the context of the file or folder.

Example:
rename -filePath 1.sldprt -value "$nameWithoutExtension_$yyyy$mm$dd$extension"`,
    keywords: ["eval", "placeholder", "dynamic", "alias", "substitution", "variable", "expression", "template", "dollar sign", "value", "name", "extension", "date", "guid", "username", "vaultname"],
    category: "scripting"
  },
  {
    id: "export",
    title: "EXPORT Command",
    content: `The ExportCommand allows you to export SOLIDWORKS files from the PDM vault to various formats using SOLIDWORKS. This command supports exporting a single file or multiple files found via search, with options for specifying file extensions, export location, and more.

SYNTAX:
export [-search|-filePath] -name -directory -extensions -recursive

PARAMETERS:
- filePath: Path to the file to export (relative or absolute).
- name: The base name for the exported file(s). Supports evaluation.
- directory: The target folder for exported files.
- extensions: Comma-separated list of file extensions to export to (e.g., pdf,dxf).
- search: Search query to find files for export.
- recursive: If set, search will include subfolders.
- timeout: timeout in seconds (for starting SOLIDWORKS only).

EXAMPLE:
export -filePath "Designs/part1.sldprt" -name "part1_export" -directory "Exports" -extensions "pdf,dxf"`,
    keywords: ["export", "convert", "save as", "pdf", "dxf", "stp", "step", "solidworks", "format", "extensions", "batch export"],
    category: "export"
  },
  {
    id: "freevspremium",
    title: "PDMShell Free vs Premium",
    content: `PDMShell comes in two editions: Free for light use and Premium for full automation in SOLIDWORKS PDM.

Free Edition:
- Max 5 items per command
- All search commands included
- Alias & renaming included
- No workflow & transitions
- No automation scripting
- No priority support
- No reseller use

Premium Edition:
- Unlimited items per command
- All search commands included
- Workflow & transitions
- Automation scripting
- Full priority support
- Commercial and reseller use

The Free Edition is ideal for evaluation and quick lookups with a limit of 5 items per command. Resellers and VARs may not use the Free version commercially.

To buy a Premium PDMShell license, visit: http://bluebyte.biz/product/pdmshell`,
    keywords: ["free", "premium", "license", "pricing", "limits", "commercial", "reseller", "compare", "features"],
    category: "general"
  },
  {
    id: "frogleap",
    title: "FROGLEAP Command",
    content: `Frog leaps an old version as newest. This effectively takes an older version and makes it the newest version of the file.

SYNTAX:
frogleap -search -filePath -oldVersion

PARAMETERS:
- search: The search operation to use.
- filePath: The file(s) to be frog leaped. This is the default parameter.
- oldVersion: The old version to leap. This is an integer.

EXAMPLES:
frogleap -filePath "file1.sldprt" -oldVersion 2

REMARKS:
- The search parameter searches the current directory and does not drill down. The search query is a PDM one, so you can use % for wildcard.`,
    keywords: ["frogleap", "frog leap", "version", "rollback", "revert", "promote", "old version", "restore version"],
    category: "version-control"
  },
  {
    id: "get",
    title: "GET Command",
    content: `Retrieves a specified version of a file or files (via search).

SYNTAX:
get -search -filePath -version -directory -getoptions

PARAMETERS:
- search: The search operation to use.
- filePath: The file(s) to retrieve. This is the default parameter.
- version: (Optional) The version of the file to retrieve.
- directory: (Optional) Folder where to deposit the file. Can be outside vault. Do not end with \\. If not specified, file is cached in its folder.
- getoptions: (Optional) Allows you to cache references as well.

Get Options:
- Simple: Retrieves the file with no additional options.
- MakeReadOnly: Marks the retrieved file as read-only.
- DisableRefresh: Does not refresh File Explorer after retrieval.
- RefsOnlyMissing: Retrieves only referenced files that are not already present.
- RefsVerLatest: Retrieves the latest versions of referenced files.
- RefsOverwriteLocked: Retrieves referenced files even if checked out (warning: loses local changes).
- ForPreview: Retrieves only referenced files required for preview.

EXAMPLES:
get -filePath "file1.sldprt" -Version 2

REMARKS:
- The search parameter searches the current directory and does not drill down. The search query is a PDM one, so you can use % for wildcard.`,
    keywords: ["get", "retrieve", "download", "cache", "version", "latest", "references", "local copy"],
    category: "version-control"
  },
  {
    id: "getvar",
    title: "GETVAR Command",
    content: `Gets the value of a variable for a specified file or folder.

SYNTAX:
getvar -filePath -variableName -configs -clear -version

PARAMETERS:
- filePath: The file or folder to get the variable from.
- variableName: The variable name to retrieve.
- configs: The configuration names to retrieve the variable from, separated by commas.
- clear: Clears the variable value.
- version: The version of the file to retrieve the variable from.

EXAMPLES:
getvar -filePath "file1.sldprt" -variableName "CustomVar"

REMARKS:
- The configuration names should be separated by commas.
- The variable must be in the data card.
- This command will return what's in the local cache which may not be necessarily the latest version. For that, please use getVarFromDB.`,
    keywords: ["getvar", "get variable", "read variable", "data card", "configuration", "value", "property"],
    category: "variables"
  },
  {
    id: "getvarfromdb",
    title: "GETVARFROMDB Command",
    content: `Gets the value of a variable for a specified file or folder directly from the database.

SYNTAX:
getvarfromdb -filePath -variableName -configs

PARAMETERS:
- filePath: The file or folder to get the variable from.
- variableName: The variable name to retrieve from the database.
- configs: The configuration names to retrieve the variable from, separated by commas.

EXAMPLES:
getvarfromdb -f "file1.sldprt" -variableName "CustomVar"

REMARKS:
- The configuration names should be separated by commas.
- This command will always return the latest value.`,
    keywords: ["getvarfromdb", "get variable", "database", "latest", "read variable", "data card", "configuration", "value", "db"],
    category: "variables"
  },
  {
    id: "help",
    title: "HELP Command",
    content: `Provides help about a command.

SYNTAX:
help [-command|-c]

PARAMETERS:
- command: The specific command you need help with.

EXAMPLES:
help -c cd  # opens the help page about the change directory command`,
    keywords: ["help", "documentation", "usage", "manual", "command info"],
    category: "system"
  },
  {
    id: "history",
    title: "HISTORY Command",
    content: `Prints the history of a file.

SYNTAX:
history [-search|-filePath]

PARAMETERS:
- search: The search operation to use.
- filePath: The file to get the history for.

EXAMPLES:
history -f "file1.sldprt"
# lists the history of file1

REMARKS:
- The search parameter searches the current directory and does not drill down. The search query is a PDM one, so you can use % for wildcard.`,
    keywords: ["history", "log", "audit", "trail", "versions", "changes", "file history"],
    category: "version-control"
  },
  {
    id: "inbox",
    title: "INBOX Command",
    content: `Opens the PDM inbox or sends a message as the logged-in user.

SYNTAX:
inbox -filePath -name -value

PARAMETERS:
- name: Name of the user to send the message to.
- value: Message: supports evaluation against the filePath.
- filePath: Associated file.

EXAMPLES:
inbox -message 'File checked in successfully'
# sends the specified message to the logged-in user`,
    keywords: ["inbox", "message", "send", "notification", "user", "communicate"],
    category: "system"
  },
  {
    id: "infovar",
    title: "INFOVAR Command",
    content: `Gets information about a variable.

SYNTAX:
infovar [-v variable_name]

PARAMETERS:
- v: The variable name to retrieve information for.

EXAMPLES:
infovar -v Description`,
    keywords: ["infovar", "info variable", "variable info", "metadata", "data card", "variable details"],
    category: "variables"
  },
  {
    id: "kill",
    title: "KILL Command",
    content: `Kills a process.

SYNTAX:
kill -process

PARAMETERS:
- process: The process to terminate (with extension).

EXAMPLES:
kill sldworks.exe
# terminates all open SOLIDWORKS sessions.

REMARKS:
- This command uses taskkill from the command line.
- This command requires PDM to be run as an administrator.
- PDMShell adds a note called ADMIN in the top-right area of its window when it is open as admin.`,
    keywords: ["kill", "terminate", "process", "stop", "solidworks", "taskkill", "administrator"],
    category: "system"
  },
  {
    id: "login",
    title: "LOGIN Command",
    content: `Authenticates a user to a specified vault.

SYNTAX:
login [-auto|-win -username -password|-external -username -password] -vaultname

PARAMETERS:
- auto: Automatic authentication with current user. Displays login dialog box if not logged in.
- win: Automatic Windows authentication with current user. Does not display login dialog box.
- external: Toggle ensures that a license is consumed.
- username: Username.
- password: Password.
- vaultName: Vault Name.

EXAMPLES:
login -username admin -password ******** -vaultName bluebyte
login -auto -vaultName bluebyte

REMARKS:
- You must have a local vault view before you can start using PDMShell.
- The external parameter allows an application that is not supplied and supported by SOLIDWORKS Corporation to log into SOLIDWORKS PDM Professional.`,
    keywords: ["login", "authenticate", "sign in", "vault", "username", "password", "auto", "windows", "session", "connect"],
    category: "authentication"
  },
  {
    id: "mkdir",
    title: "MKDIR Command",
    content: `Creates a new folder.

SYNTAX:
mkdir -directory

PARAMETERS:
- directory: The folder to create. Supports placeholders.

EXAMPLES:
mkdir -directory "NewFolder"
# Creates a new folder called NewFolder

REMARKS:
- To get the new folder to show up in the auto-complete, please use the command cd -refresh.
- directory is the default parameter. You do not need to specify it.`,
    keywords: ["mkdir", "make directory", "create folder", "new folder", "directory"],
    category: "navigation"
  },
  {
    id: "mkvar",
    title: "MKVAR Command",
    content: `Creates a new variable.

SYNTAX:
mkvar -name -varType -mkvarflags -mkvarattributes

PARAMETERS:
- name: The name of the variable to create.
- varType: The type of the variable.
- mkvarflags: The flags for the variable.
- mkvarattributes: The attributes for the variable. Separated by #.

EXAMPLES:
mkvar -name "NewVariable" -varType "Text" -mkvarflags "ReadOnly" -mkvarattributes "Attribute1#Attribute2"

Var Type Values: None, Text, Int, Float, Bool, Date

MkVar Flags Values:
- Unique: Values must be unique; only for files.
- Mandatory: Missing values are not permitted; only for files.
- VerFreeUpdateAll: Every version and revision are affected by variable update.
- VerFreeLatest: Only the latest version is affected.`,
    keywords: ["mkvar", "make variable", "create variable", "new variable", "data card", "type", "flags", "attributes"],
    category: "variables"
  },
  {
    id: "print",
    title: "PRINT Command",
    content: `Displays the biographical information about the specified file.

SYNTAX:
print [-filePath|-id]

PARAMETERS:
- filePath: The file to print biographical information for.

EXAMPLES:
print -filePath "C:\\SOLIDWORKSPDM\\Bluebyte\\API\\Sandbox\\fidget spinner\\___108545.SLDPRT"

The print command will output:
- File Name, Local Path, Folder Path
- File ID, Folder ID
- HEXID, Archive Path
- Checked out status
- State ID, State Name, Current state
- Current Version, Current Revision
- Available Transitions`,
    keywords: ["print", "info", "details", "file info", "biographical", "state", "version", "archive path", "hexid", "transitions"],
    category: "file-management"
  },
  {
    id: "printfromsource",
    title: "PRINTFROMSOURCE Command",
    content: `The printfromsource command is used to validate a list of filepaths in the PDM system based on a source CSV file. The CSV file must contain a header and a list of complete file paths in the first column.

SYNTAX:
printfromsource -filePath -csv

PARAMETERS:
- filePath: (Required) The source file path. Must be a CSV file with one column: file Path (Complete file path).
- csv: Specifies the output csv with information about files from the source parameter.

EXAMPLES:
printfromsource -filePath "source.csv" -csv "output.csv"

REMARKS:
- The filePath parameter is mandatory and must point to a valid CSV file.
- The csv output contains: ID, Complete File Path, Folder ID, Checked Out, Where Used ID.`,
    keywords: ["printfromsource", "validate", "verify", "csv", "batch", "file paths", "source"],
    category: "file-management"
  },
  {
    id: "quit",
    title: "QUIT Command",
    content: `Quits the application.

SYNTAX:
quit -silent

PARAMETERS:
- silent: (Optional) suppresses the close dialog box.

REMARKS:
- This command runs silently in scripts.`,
    keywords: ["quit", "exit", "close", "end", "terminate", "silent"],
    category: "system"
  },
  {
    id: "reboot",
    title: "REBOOT Command",
    content: `Hard PDM reboot.

SYNTAX:
reboot

PARAMETERS:
This command has no parameters.

REMARKS:
- This command uses taskkill from the command prompt to kill explorer.exe and edmserver.exe then restart explorer.exe.
- It requires PDM to be run as an administrator.`,
    keywords: ["reboot", "restart", "reset", "explorer", "edmserver", "administrator", "hard reboot"],
    category: "system"
  },
  {
    id: "recover",
    title: "RECOVER Command",
    content: `The recover command is used to recover files from a specified directory or source. It supports optional parameters for search queries and recursive operations.

SYNTAX:
recover -directory -search -recursive -source

PARAMETERS:
- directory: Specifies the directory to recover files from. Optional.
- search: A search query to filter the files to recover. Optional. Supports % and * as wildcards.
- recursive: Enables recursive recovery of files within subdirectories. Optional.
- source: Specifies the source to recover files from. Optional.

To generate a source csv file, use: delete -list -csv deletedfiles.csv

EXAMPLES:
recover -source "source.csv"
recover -directory ""
# Recovers files from the current directory.

REMARKS:
- Ensure that the specified directory or source exists and is accessible.`,
    keywords: ["recover", "restore", "undelete", "bring back", "deleted files", "csv", "source"],
    category: "file-management"
  },
  {
    id: "rename",
    title: "RENAME Command",
    content: `Renames a specified file.

SYNTAX:
rename -filePath -value -search

PARAMETERS:
- filePath: The file to rename.
- value: The new name for the file. YOU MUST INCLUDE THE EXTENSION.
- search: The search operation to use.

EXAMPLES:
rename -filePath "oldname.sldprt" -val "newname.sldprt"

REMARKS:
- The search parameter searches the current directory and does not drill down. The search query is a PDM one, so you can use % for wildcard.

VALUE EVALUATION:
The value parameter gets evaluated by PDMShell. Supported placeholders:
- $filename: The file name without extension.
- $id: The file ID.
- $revision: The current revision.
- $date: The current date.
- $time: The current time.
- $version: The current version.
- $extension: The file extension.

You can also use variables enclosed in square brackets (e.g., [VariableName]).

Example: Using "$filename_$date_$version$extension" results in something like "oldname_10-12-2023_3".`,
    keywords: ["rename", "rename file", "change name", "value", "extension", "placeholder", "evaluation"],
    category: "file-management"
  },
  {
    id: "renamefromsource",
    title: "RENAMEFROMSOURCE Command",
    content: `The renamefromsource command is used to rename files in the PDM system based on a source CSV file. The CSV file provides the necessary information to map file IDs to their new names and folder IDs. This command supports alias evaluation for dynamic renaming.

SYNTAX:
renamefromsource -filePath -evaluatealias -csv

PARAMETERS:
- filePath: (Required) The source file path. Must be a CSV file with three columns: File ID, New File Name (including extension), Folder ID.
- evaluatealias: Toggle. Allows placeholders to be used in the new file name.
- csv: Specifies the path to an additional CSV file for batch renaming.

EXAMPLES:
renamefromsource -filePath "C:\\data\\rename.csv" -evaluatealias

CSV FORMAT:
File ID | New File Name | Folder ID
123     | newfile1.txt  | 456

REMARKS:
- The filePath parameter is mandatory and must point to a valid CSV file.
- The evaluatealias parameter supports dynamic placeholders for renaming, such as $name, $revision, $yyyy, etc.`,
    keywords: ["renamefromsource", "rename", "batch rename", "csv", "bulk rename", "source", "alias", "evaluation"],
    category: "file-management"
  },
  {
    id: "runscript",
    title: "RUNSCRIPT Command",
    content: `Runs a PDMShell script.

SYNTAX:
runscript -source -filePath -search -recursive

PARAMETERS:
- source: Script file. Must end in .pdmshell.
- filePath: File path to run the script on.
- search: Search query to filter files.
- recursive: If specified, the command will run script on all files recursively in subdirectories.

EXAMPLES:
runscript -filePath pdmscript.pdmshell -search "%.sldprt" -recursive
# this will run pdm.script on all part files in the active directory and its subdirectories

REMARKS:
- A good way to start a script is using the start notepad.exe command to open up notepad.exe.
- In your script, you must use the alias $completefilename and $completefoldername to reference the file your script is targeting. This is required with the search or filePath parameters.

FREE VERSION LIMIT:
- The free version is limited to 10 lines per script.`,
    keywords: ["runscript", "run script", "execute", "pdmshell", "automation", "batch", "scripting"],
    category: "scripting"
  },
  {
    id: "runtask",
    title: "RUNTASK Command",
    content: `The RUNTASK command allows you to execute a PDM task on a specific file or via search in the PDM vault.

SYNTAX:
runtask -taskName -filePath -search -recursive

PARAMETERS:
- taskName: Task name. This can be found under Tasks in the Administration tool.
- filePath: Path to the affected file.
- search: (Optional) Search query to find files.
- recursive: (Optional) If set, search will include subfolders.

EXAMPLE:
taskrun -TaskName "PrintPDF" -filePath "Assembly.sldasm"`,
    keywords: ["runtask", "task", "execute", "pdm task", "administration", "automation"],
    category: "scripting"
  },
  {
    id: "search",
    title: "SEARCH Command",
    content: `The search command allows users to search for files and folders in the current directory. It supports recursive searches, filtering, and output customization.

SYNTAX:
search -search -recursive -includesubfolders -csv -columns

PARAMETERS:
- search: Search keyword. Supports SQL wildcard %.
- recursive: Searches through all subdirectories recursively.
- includesubfolders: Includes subfolders in the search results.
- csv: Outputs the search results in CSV format.
- columns: Specifies the columns to include in the output.

EXAMPLES:
search -search %  # prints all the files in the current directory
search -search -recursive -includesubfolders  # prints all files and folders recursively
search -search -csv -columns "Description,PartNumber"  # Export with specific columns

REMARKS:
- We have introduced Advanced Search capabilities that can be used in the -search parameter.
- Ensure the current directory is set correctly before running the command.
- Use the -columns parameter to customize the output. Data is pulled from @ for configuration-supported documents.`,
    keywords: ["search", "find", "query", "wildcard", "filter", "csv", "columns", "recursive", "lookup"],
    category: "search"
  },
  {
    id: "searchfromsource",
    title: "SEARCHFROMSOURCE Command",
    content: `The searchfromsource command reads a CSV source file and uses the first column (ignoring the header) as input items to search for in the vault.

For every row in the source CSV, PDMShell performs a vault search and returns:
- File ID, Full vault path, Parent folder ID, Checked-out status, Where Used parent file IDs.

SYNTAX:
searchfromsource -filePath -recursive -csv

PARAMETERS:
- filePath: Path to the source CSV file. If absolute, used directly. If relative, combined with current directory. The source file must exist in the vault.
- recursive: If specified, recursive search through all subfolders.
- csv: Optional output CSV file name/path. If the file exists in the vault it is updated. If it does not exist, it is created and added to the vault.

INPUT CSV FORMAT:
- Comma-delimited CSV, first row is treated as a header and ignored, only the first column is used.
- Empty rows are ignored, values are trimmed.
- Input Example 1 - Plain file names: bracket.sldprt, frame.sldasm, cover.sldprt
- Input Example 2 - Mixed document types: 100023.sldprt, 100023.slddrw, Datasheet_100023.pdf
- Input Example 3 - Wildcards: %.sldprt, %.sldasm, %.slddrw
- Input Example 4 - Advanced search expressions: "Name=%.slddrw", "Name=%.sldprt;Locked=true"
- THE VALUES CAN BE A SEARCH QUERY. See the Advanced Search guide for full syntax.

OUTPUT CSV FORMAT (when -csv is used):
Columns: ID, FileName, Path, ParentFolderID, ParentFolder, IsCheckedOut, WhereUsedIds
- ID: PDM file ID returned by search
- FileName: The original value read from the source CSV first column
- Path: Full vault path returned by the search result
- ParentFolderID: Folder ID containing the file
- ParentFolder: Folder path derived from the result path
- IsCheckedOut: True/False based on PDM lock status
- WhereUsedIds: Comma-separated list of parent file IDs from the reference tree

EXAMPLES:
searchfromsource -filePath "input.csv"
searchfromsource -filePath "input.csv" -recursive
searchfromsource -filePath "input.csv" -recursive -csv "results.csv"

NOTES:
- This command requires the user to be logged in to a vault.
- The input CSV must be accessible locally (PDM will download the file when needed).
- If the vault search yields no result for a row, the command prints a warning and continues.
- Output CSV values are CSV-escaped (commas, quotes, newlines).
- Where Used results are generated using the reference tree lookup.

LIMITATIONS:
- Only the first search result is used (GetFirstResult()).
- Only file results are processed (folder results are ignored).
- The input file is interpreted as comma-delimited CSV only.`,
    keywords: ["searchfromsource", "search", "csv", "batch search", "bulk", "source", "where used", "vault search"],
    category: "search"
  },
  {
    id: "setrevision",
    title: "SETREVISION Command",
    content: `The SetRevisionCommand allows you to set the PDM-managed revision of a file inside the vault. This command updates the official PDM Revision (the value shown on the version tab), not the datacard one.

You may set the revision using:
- %nextrevision% - moves the revision forward
- %previousrevision% - moves the revision backward
- %initial% - resets to the first revision in the revision scheme
- [VariableName] - evaluates the variable on the file and applies its value as the new revision

SYNTAX:
setrevision -filePath|-search -value -csv

PARAMETERS:
- filePath: Path to the file whose revision you want to update.
- search: Search query in the current folder.
- value: The revision value to apply (%nextrevision%, %previousrevision%, %initial%, [VariableName], or literal).
- csv: (only valid with search) Save results to a csv file.

NOTES:
- This command affects only the PDM Revision, not custom properties.
- When using [VariableName], ensure the variable is present on the file card.
- %previousrevision% will adjust only if the revision scheme allows backward movement.
- %nextrevision% respects all revision scheme rules.

AVAILABILITY: 3.0.11`,
    keywords: ["setrevision", "set revision", "revision", "increment", "nextrevision", "previousrevision", "initial", "version tab"],
    category: "version-control"
  },
  {
    id: "setrevisionfromsource",
    title: "SETREVISIONFROMSOURCE Command",
    content: `The SetRevisionFromSourceCommand allows you to batch-update the PDM-managed revision for multiple files by reading values from a CSV input source.

The source CSV must contain: Id (PDM file ID) and Value (revision value to apply).

SYNTAX:
setrevisionfromsource -source -csv

PARAMETERS:
- source: Path to the CSV file. Required columns: ID (file's PDM ID), Revision (revision string).
- csv: (optional) Path to output CSV file with results.

EXAMPLES:
setrevisionfromsource -source source.csv -csv results.csv

NOTES:
- Updates the PDM Revision shown on the Version tab, not datacard variables.
- All revisions must already exist in the active revision scheme.
- If a file ID cannot be updated, the error is logged and processing continues.

AVAILABILITY: 3.0.12`,
    keywords: ["setrevisionfromsource", "batch revision", "csv", "bulk", "source", "revision update"],
    category: "version-control"
  },
  {
    id: "setvar",
    title: "SETVAR Command",
    content: `Sets the value of a variable for a specified checked out file or many checked out files.

SYNTAX:
setvar [-filePath|-search] -variableName -value [-configNames] [-stringformat]

PARAMETERS:
- filePath: The file to set the variable for.
- variableName: The variable to set.
- value: The value to assign to the variable.
- configNames: The configuration names to set the variable for, separated by commas.
- search: The search operation to use.
- stringformat: String format option.

EXAMPLES:
setvar -filePath file1.sldprt -variableName Description -value $value -stringformat UpperCase

EVALUATION:
The value parameter gets evaluated by PDMShell. Supports dynamic placeholders.

REMARKS:
- configNames should be separated by commas. If omitted, PDMShell uses @ for configuration-supported documents.
- The search parameter searches the current directory and does not drill down.
- stringformat options: UpperCase, LowerCase, CamelCase, FirstLetterCase.

As of version 3.0.9, support for setting folder datacard variables was added.`,
    keywords: ["setvar", "set variable", "write variable", "data card", "value", "configuration", "stringformat", "uppercase", "lowercase"],
    category: "variables"
  },
  {
    id: "setvarsfromsource",
    title: "SETVARSFROMSOURCE Command",
    content: `Sets variables for multiple files using a CSV file as the source.

SYNTAX:
setvarsfromsource -source

PARAMETERS:
- source: The CSV file containing the file IDs and variable values.

CSV FILE FORMAT:
FileID,Variable1,Variable2,...
XXXX,Value1,Value2,...

EXAMPLES:
setvarsfromsource -source variables.csv  # the source file must exist in the current directory

REMARKS:
- The CSV file should have the first column as the file ID and the subsequent columns as the variable names.
- You need to include the extension in the filename. This file can be outside the vault.
- The best way to generate a source CSV is to use the dir command or the search command with -csv and columns:
  dir -columns Description,"Part Number" -csv data.csv
  search -search %.sldprt -recursive -columns Description,"Part Number" -csv data.csv`,
    keywords: ["setvarsfromsource", "set variables", "batch", "csv", "bulk", "source", "data card", "multiple files"],
    category: "variables"
  },
  {
    id: "start",
    title: "START Command",
    content: `The start command is used to launch programs, tools, or specific applications. It supports launching SOLIDWORKS, the PDM administration tool, Notepad, Windows Explorer, and other custom programs.

SYNTAX:
start -process -swversion

PARAMETERS:
- process: (Optional) Specifies the program to start:
  - admin: Launches the PDM administration tool.
  - notepad: Launches Notepad.
  - apihelp: Opens the SOLIDWORKS API help file.
  - explorer: Opens Windows Explorer.
  - . (dot): Opens the current folder in Windows Explorer.
- swversion: (Optional) Specifies the version of SOLIDWORKS to launch (e.g., 2023).

EXAMPLES:
start admin  # Launch the PDM administration tool

REMARKS:
- The admin option launches the PDM administration tool.
- The notepad option launches the default Notepad application.
- The apihelp option opens the SOLIDWORKS API help file.
- The explorer or . option opens Windows Explorer or the current folder.`,
    keywords: ["start", "launch", "open", "program", "solidworks", "admin", "notepad", "explorer", "application"],
    category: "system"
  },
  {
    id: "taskscript",
    title: "TaskScript (Run Script as Task)",
    content: `TaskScript is a custom PDM task add-in developed by Blue Byte Systems Inc. that allows you to execute PDMShell scripts the same way you would use the built-in Convert task.

This task can be requested upon purchase of a premium license of PDMShell. To request after purchase, email support@bluebytesystemsinc.zohodesk.com.

Key Features:
- Execute PDMShell commands in response to PDM task triggers
- Dynamic script editing and variable binding
- Reuses existing scripts stored locally or downloaded
- Supports file filtering based on extensions
- Evaluates placeholders like $fileName, $localPath, and more
- Handles script failure with detailed logging

UI Components:
- Available Scripts dropdown: Shows available .pdmshell scripts that can be downloaded. Selecting a script loads it into the editor.
- DOWNLOAD SELECTED: Downloads the currently selected script file.
- REQUEST A SCRIPT: Opens a preformatted email to request a custom script.
- REFRESH: Reloads the available script list.
- Script Editor: Multi-line editable area for entering or modifying .pdmshell scripts. Lines starting with # are treated as comments. Syntax highlighting shows comments in italic green.
- Extensions and test button: Specify the extensions to process. TEST WITH FILE allows testing your script before running it.

TaskScript Placeholder Variables:
- $localPath: Full local path to the selected file
- $fileName: File name (including extension)
- $id: Internal PDM file ID
- $folderPath: Full local path to the file's parent folder
- $folderID: Internal PDM folder ID
- $fileNameWithoutExtension: File name without the extension
- $vaultName: Name of the vault
- $vaultRootFolder: Local root path of the vault
- $(Variable.Configuration): Value of a custom PDM variable for a given configuration

$(Variable.Configuration) Usage Notes:
- Use @ for the @ tab. Example: $(Description.@)
- Use empty string for files with no configurations. Example: $(Description. )

Example Script:
cd/
print -id $id

REMARKS:
- You can include the extensions: sldprt;sldasm;slddrw are the default value.
- TaskScript will run PDMShell sessions on all affected documents by the task.
- Do not forget to set the Command Menu tab.
- Lines starting with # are treated as comments.
- You can request a script by emailing via the Request Script button.`,
    keywords: ["taskscript", "task", "add-in", "premium", "automation", "trigger", "convert", "pdm task", "placeholder", "variable configuration"],
    category: "scripting"
  },
  {
    id: "undocheckout",
    title: "UNDOCHECKOUT Command",
    content: `Undoes a checkout operation.

SYNTAX:
undocheckout [-filePath | -search]

PARAMETERS:
- filePath: The file to undo the checkout for.
- search: The search operation to use.

EXAMPLES:
undocheckout -f "file1.sldprt"

REMARKS:
- The search parameter searches the current directory and does not drill down. The search query is a PDM one, so you can use % for wildcard.`,
    keywords: ["undocheckout", "undo checkout", "undo check out", "cancel checkout", "unlock", "revert"],
    category: "version-control"
  },
  {
    id: "updatereferences",
    title: "UPDATEREFERENCES Command",
    content: `Updates file references inside the SOLIDWORKS PDM vault.

The updatereferences command modifies references stored inside files, without opening SOLIDWORKS, and allows you to:
- Update references for a single file
- Update references for multiple files using a search
- Resolve references by locating matching files inside a specified directory
- Control which references are updated using a scope parameter

This command is especially useful for fixing broken references, updating references after migrations, or correcting references that point outside the vault.

SYNTAX:
updatereferences -filepath -search -directory -scope -recursive

PARAMETERS:
- filepath: Optional. Updates references for a single file.
- search: Optional. Search query for files whose references should be updated. Supports % wildcards.
- directory: Optional. Defines where replacement references are searched.
- scope: Optional. Controls which references are updated:
  - UpdateOutsideVaultReferenceOnly: Updates references pointing outside the vault
  - UpdateBrokenReferences: Updates missing or broken references
  - UpdateAllReferences: Updates all references
- recursive: Optional. With search, includes subfolders.

BEHAVIOR:
- Operates directly on file reference data
- Does not open SOLIDWORKS
- Requires files to be checked out
- Uses vault searches to locate replacement references

EXAMPLES:
updatereferences -filepath speaker.sldasm -directory Libraries -scope UpdateOutsideVaultReferenceOnly
updatereferences -search %.sldasm -scope UpdateBrokenReferences

REMARKS:
- Either filepath or search must be specified.
- If both are provided, filepath takes precedence.
- Reference resolution is based on matching file names within the directory scope.
- This command modifies files directly; use with care.`,
    keywords: ["updatereferences", "update references", "fix references", "broken references", "migration", "scope", "outside vault", "repair"],
    category: "file-management"
  },
  {
    id: "users",
    title: "USERS Command",
    content: `Lists all the users in the active vault.

SYNTAX:
users

PARAMETERS:
None.

EXAMPLES:
users`,
    keywords: ["users", "list users", "vault users", "accounts", "people"],
    category: "authentication"
  },
  {
    id: "version",
    title: "VERSION Command",
    content: `Displays version information for PDMShell, installed SOLIDWORKS, or the PDM client.

SYNTAX:
version -solidworks -pdm

PARAMETERS:
- No parameters: Displays the version of PDMShell.
- solidworks: Displays the versions of installed SOLIDWORKS. RESERVED FOR FUTURE. NOT IMPLEMENTED.
- pdm: Displays the version of the installed PDM client. RESERVED FOR FUTURE. NOT IMPLEMENTED.

EXAMPLES:
version -solidworks
# lists all the installed solidworks versions`,
    keywords: ["version", "info", "solidworks version", "pdm version", "pdmshell version", "installed"],
    category: "system"
  },
  {
    id: "versionupgrade",
    title: "VERSIONUPGRADE Command",
    content: `The VersionUpgradeCommand provides tools for bumping PDM revisions, validating file references, and exporting broken reference results to a CSV file.

A SOLIDWORKS file upgrade increments the file version and thus the revision. Use -bumprevision to reset the revision back to the previous value prior to the file upgrade.

SYNTAX:
versionupgrade -search <query> [-recursive] [-bumprevision] [-referencescheck] [-csv <fileName>]

PARAMETERS:
- search: Search query used to locate files for the version upgrade operation. If omitted, no files will be processed. Consult advanced search to learn how to create advanced search queries.
- recursive: Searches through all subfolders from the current folder. Not required if using Recursive=true in search.
- bumprevision: Increments the PDM revision of each file returned from the search. Requires the logged-in user to have the permission: Modify revision numbers (EdmSysRight_ModifyRevisionNumbers).
- referencescheck: Runs PDM's Reference Check. Detects missing references, wrong versions, outdated references, and broken or invalid reference paths. Any issues found are stored in an internal list and may be exported via the csv parameter.
- csv: Exports reference-check issues to a CSV file. If the file exists in the vault, it is updated. If it does not exist, it is added to the vault.

CSV OUTPUT FORMAT:
The CSV uses the fields of the EdmCheckRef structure:
Columns: ParentFileID, RefFileID, ParentPath, RefPath, RefVersion, RefLatestVersion, RefFolderID
- mlParentFileID: Parent file ID
- mlRefFileID: Referenced file ID
- mbsParentPath: Full vault path of the parent file
- mbsRefPath: Full vault path of the referenced file
- mlRefVersion: Current reference version
- mlRefLatestVersion: Latest available version of the referenced file
- mlRefFolderID: Folder ID of the referenced file
Each result row represents a reference that is out of date, missing, or mismatched according to PDM rules.

Behavior notes for CSV:
- Fully-qualified paths inside the vault are handled correctly.
- CSV escaping is applied (quotes, commas, newlines).
- UTF-8 encoding without BOM is used for compatibility.
- If the CSV file is checked out, a warning is returned.

WORKFLOW:
1. Search for files using the supplied query and optional recursion.
2. Perform operations: -bumprevision increments revision counters, -referencescheck checks all references for correctness.
3. CSV Export (optional): If both search and referencescheck are supplied and csv is specified, writes reference errors to CSV, adds or updates the file in the vault.

NOTES:
- bumprevision and referencescheck operate only on files returned by the search.
- CSV exporting is only active when both search and referencescheck are supplied.
- The reference check output may include many entries depending on assembly depth.
- This command does not modify file content — it only updates revision metadata or reference validation results.
- Bulk operations respect PDM permissions and may fail if the user lacks rights.

AVAILABILITY: 3.0.13`,
    keywords: ["versionupgrade", "version upgrade", "bump revision", "references check", "broken references", "csv", "migration", "upgrade", "EdmCheckRef"],
    category: "version-control"
  },
  {
    id: "advancedsearch",
    title: "Advanced Search Guide",
    content: `PDMShell provides a complete search engine based on PDM's own search. This feature is extremely useful with commands that have a -search parameter.

WILDCARDS (SQL-Style Pattern Matching):
- %: Matches zero or more characters. Example: %.sldprt returns all part files.
- _: Matches exactly one character. Example: pump_.sldprt matches pump1.sldprt but not pump10.sldprt.

SIMPLE SEARCHES:
If no operators are present, the entire input is treated as a Name filter.
Examples: pump.sldprt, %.sldasm, assembly_1001

ADVANCED SYNTAX:
Multiple conditions are separated using semicolons.
Example: Name=%Pump%;Recursive=true;VersionsBefore=20200101
Note: Dates must follow the yyyyMMdd format.

Escaping rules:
- \\; inserts a semicolon
- \\= inserts an equals sign
- \\\\ inserts a literal backslash
Example: Name=Valve\\=A;Label=Released\\;Approved

BUILT-IN SEARCH TOKENS (all supported):
- Name: File or folder name filter
- AllVersions: Search all versions
- ContentText: Full-text content search string
- ContentTextExact: Exact match of content
- ContentTextInBody: Search inside file body
- ContentTextInProperties: Search in custom properties
- ContentTextOr: Match any word
- FindFiles: Include files in results
- FindFolders: Include folders in results
- FindItems: Include items in results
- FolderID: Starting folder ID
- HistoryAfter: Search history after date
- HistoryBefore: Search history before date
- HistoryString: History string search
- HistoryStringConfiguration: Search configuration names
- HistoryStringFileName: Search file names in history
- HistoryStringLabels: Search labels in history
- HistoryStringRevisionComment: Search revision comments
- HistoryStringStateComment: Search state change comments
- HistoryStringVariableValues: Search variable changes
- HistoryStringVersionComment: Search version comments
- Label: Search label text
- LabelAfter: Labels after date
- LabelBefore: Labels before date
- LabelByUser: Labels created by user
- LabelComment: Search label comment
- Locked: Return checked-out files
- LockedBy: Return files locked by user
- Recursive: Include subfolders
- StateAfter: State changes after date
- StateBefore: State changes before date
- StateByUser: User who changed state
- StateHistoric: Search historic states
- StateID: Workflow state ID
- StateName: Workflow state name
- Unlocked: Return checked-in files
- VersionComment: Search version comment
- VersionsAfter: Versions after date
- VersionsBefore: Versions before date
- VersionsByUser: Versions created by user
- WorkflowName: Search by workflow name

DEFAULT BEHAVIOR:
- FolderID defaults to the active directory.
- Recursive defaults to the global flag.
- FindFolders defaults to the includefolders flag.
- FindFiles is always true.

VARIABLE SEARCH:
Format: @VariableName Operator Value
Examples:
@Description=Pump (equals)
@Weight>=10 (greater or equal)
@Revision!=A (not equal)
@Material~Steel (contains)
@ProjectCode!~TEST (does not contain)

PDMShell automatically: detects the operator, extracts variable name and value, looks up the variable definition, determines the variable type, converts the value to the correct type, selects the appropriate EdmVarOp enum, and applies AddVariable2.

SUPPORTED OPERATORS:
= (Equal), != or <> (Not equal), > (Greater than), < (Less than), >= (Greater or equal), <= (Less or equal), ~ (Contains), !~ (Does not contain)

OPERATOR DETECTION ORDER (longest-first to avoid ambiguity):
>=, <=, !=, <>, !~, ~, >, <, =
This ensures >= is not incorrectly parsed as >.

COMBINING TOKENS AND VARIABLES:
Name=%Pump%;@Description~Steel;StateName=Released;@Weight>=5
All conditions must match.

INVALID INPUT HANDLING:
Invalid expressions are ignored silently. PDMShell continues applying valid conditions. Examples: @MissingVar=Test, HistoryBefore=BADDATE, UnknownKey=Value.`,
    keywords: ["advanced search", "search", "wildcard", "query", "filter", "tokens", "variables", "operators", "contains", "equals", "pattern", "sql", "label", "state", "history", "content", "locked"],
    category: "search"
  },
  {
    id: "dispatch",
    title: "Running PDMShell Scripts from Dispatch",
    content: `When you want to run PDMShell scripts from Dispatch, you can use the Shell Command action.

Shell Command Settings:
1. Verb: Leave this field empty.
2. Filename: Specify the path to pdmcli.exe. Do not wrap the path in quotes, even if it contains spaces.
3. Parameters: Use the format: runscript "pathToScript" [additional parameters]

Example Configuration:
Verb: (empty)
Filename: C:\\Program Files (x86)\\BLUE BYTE SYSTEMS INC\\PDMShell\\PDMCLI.exe
Parameters: runscript "C:\\Scripts\\frogleap.pdmshell" "%PathToSelectedFile%" "%OldVersion%"

Example Script (frogleap.pdmshell):
# check selected file out
checkout -filePath "$parameter1$"
# frogleap version to specified version
frogleap -filePath "$parameter1$" -oldVersion "$parameter2$"
# save changes
checkin -filePath "$parameter1$" -comment "prompted version $parameter2$"
# you must call this
quit

Tips:
- Test your scripts independently before integrating with Dispatch.
- Use quotes for paths and parameters if they contain spaces.`,
    keywords: ["dispatch", "shell command", "pdmcli", "automation", "workflow", "parameter", "integration"],
    category: "scripting"
  },
  {
    id: "escapingquotes",
    title: "Quote Escaping Rules",
    content: `Learn how to properly escape quotes when calling PDMShell from cmd.exe, Dispatch, or inside a PDMShell session.

When calling from command line (cmd.exe or Dispatch):
Using \\" in cmd.exe will produce " in the PDMShell session:
pdmcli.exe /single help -command \\"checkout\\"

Using \\\\\\"" in cmd.exe will produce \\" in the PDMShell session which evaluates as ":
pdmcli.exe /single setvar -filePath membrane.sldprt -variableName Description -value \\" 1 \\\\\\"" 3\\"

When calling from PDMShell regular session:
To escape ", use \\":
setvar -filePath membrane.sldprt -VariableName Description -value "3/1"
setvar -filePath membrane.sldprt -VariableName Description -value "3/\\"1"
# Result: 3/"1`,
    keywords: ["escaping", "quotes", "escape", "cmd", "command line", "dispatch", "backslash", "special characters"],
    category: "scripting"
  },
  {
    id: "scripting",
    title: "Scripting in PDMShell",
    content: `PDMShell supports scripting to automate tasks and streamline workflows. Scripts use the .pdmshell file extension and are plain text files.

CREATING A SCRIPT:
A PDMShell script is a sequence of PDMShell commands written in a plain text file. Each command is executed in order.

Script File Extension: .pdmshell

Example Script:
# Navigate to the working directory
cd "\\api\\sandbox\\fidget spinner"
# Create a new export folder
mkdir "$name-export-$date"
# Export all parts as STEP files
export -search %.sldprt -directory "$name-export-$date" -extensions stp -name $namewithoutextension-$yyyy-$mm-$dd
# Change to the export folder
cd "$name-export-$date"
# Add exported files to the vault
addtovault -source " "
# Check in all files
checkin -search %
# Open folder in Explorer
start .

COMMENTS:
Lines that start with # are ignored.

EXECUTING A SCRIPT:
1. Using pdmcli.exe: pdmcli.exe "C:\\Scripts\\example.pdmshell"
   Found in: Program Files (x86)\\BLUE BYTE SYSTEMS INC
2. Using runscript command: runscript -source "C:\\Scripts\\example.pdmshell"

WORKFLOW INTEGRATION:
Premium Version users can hook pdmcli.exe into workflow transitions for automatic script execution.

REMARKS:
- Scripts are plain text files with .pdmshell extension.
- Use comments (#) for documentation.
- Ensure the file is saved with .pdmshell extension.`,
    keywords: ["scripting", "script", "automation", "pdmshell", "batch", "workflow", "plain text", "commands", "pdmcli"],
    category: "scripting"
  },
  {
    id: "scriptsfromtransition",
    title: "Running Scripts from Workflow Transitions",
    content: `When you want to run PDMShell scripts as part of a workflow transition in SOLIDWORKS PDM, you can configure the transition to execute scripts.

Workflow Transition Configuration:
1. Action Type: Set to Execute Command.
2. Command: "path_to_pdmcli.exe" runscript "pathToScript" [additional parameters]
3. Make sure to check "Wait until the started program terminates."

Example:
"C:\\Program Files (x86)\\BLUE BYTE SYSTEMS INC\\PDMShell\\PDMCLI.exe" runscript "C:\\Scripts\\clearvariables.pdmshell" "FilePath"

Example Script (clearvariables.pdmshell):
checkout -filePath "$parameter1$"
setvar -filePath "$parameter1$" -variableName Description -Value ""
checkin -filePath "$parameter1$" -comment "cleared description"
cd\\
cd logs
dump clearvariables_$yyyy-$mm-$dd_$guid.txt
quit

Tips:
- Always test scripts independently before integrating with workflow transitions.
- Wrap paths and parameters in quotes if they contain spaces.
- You must call quit at the end of the script.`,
    keywords: ["transition", "workflow", "execute command", "pdmcli", "automation", "workflow transition", "state change"],
    category: "scripting"
  },
  {
    id: "instances",
    title: "Single Instance Mode",
    content: `PDMShell can run in two modes: Multi Instance Mode (default) and Single Instance Mode.

Single instance mode is useful for faster execution and sequential automation pipelines.

To enable Single Instance Mode:
pdmcli.exe /single  (or pdmcli.exe -single)

When running in Single Instance Mode, a "1" icon appears in the top-right corner. In multi-instance mode, an infinity symbol is shown.

Benefits:
- Reuse the same PDMShell instance for subsequent commands
- Improve performance when triggered from cmd.exe or Dispatch
- Prevent multiple conflicting PDMShell instances

UAC and Permissions:
- If the first instance is started as Admin, all following calls must also run as Admin.
- If started without elevation, all following calls must also run without elevation.
- Avoid running as Windows Administrator if you have custom add-ins installed to prevent "Class not registered" errors.

Executing Commands:
All subsequent calls must also include /single, or a new instance will launch.
Example: pdmcli.exe /single "help command checkout"

When calling from cmd.exe, /single or -single cannot be contained in the double quote.

Tips:
- Always include /single in every call.
- Use proper quote escaping when calling from Dispatch.
- Use Single Instance mode for sequences; Multi Instance for isolated commands.`,
    keywords: ["single instance", "multi instance", "instance", "mode", "pdmcli", "performance", "sequential", "uac", "administrator"],
    category: "system"
  },
  {
    id: "introduction",
    title: "Introduction to PDMShell",
    content: `Welcome to PDMShell, the command-line interpreter designed specifically for SOLIDWORKS PDM Professional.

Using the Help System:
- To view all available commands: help
- To get details about a specific command: help -command <command>

Command Documentation Structure:
1. DESCRIPTION: Brief explanation of what the command does.
2. SYNTAX: The syntax including required and optional parameters.
3. PARAMETERS: Detailed explanation of each parameter.
4. EXAMPLES: Practical examples.
5. REMARKS: Additional notes, tips, or special considerations.
6. TUTORIAL: Video tutorial (if available).

Case Sensitivity:
As of PDMShell 3.0.1, all command names, parameter names, and values are case-sensitive.

Escaping Quotes:
Depends on where the command originates. See the dedicated escaping quotes article.`,
    keywords: ["introduction", "getting started", "help", "commands", "syntax", "parameters", "case sensitive", "overview"],
    category: "general"
  },
  {
    id: "parameter_short_format",
    title: "Short Format for Parameters",
    content: `PDMShell supports short formats for many of its parameters to make commands more concise and easier to use.

Complete List of Parameters and Their Short Formats:
- username -> u (Specifies the username for authentication)
- password -> p (Specifies the password for authentication)
- vaultName -> v (Specifies the name of the PDM vault)
- filePath -> f (Specifies the file path to operate on)
- command -> c (Specifies the command name)
- search -> s (Specifies the search query, can use % for wildcard)
- directory -> d (Specifies the directory, wrap in "" if spaces)
- columns -> cols (Specifies output columns, separate multiple by comma)
- csv -> csv (Specifies the CSV file, include extension)
- sort -> sort (Specifies sort order by column name, used in dir command)
- programName -> prog (Specifies the program name)
- configNames -> configs (Specifies configuration names, separate multiple by comma)
- value -> val (Specifies the value to set, wrap in "" if spaces)
- version -> ver (Specifies the version of the file or software)
- variableName -> var (Specifies the name of the variable)
- clearToggle -> cls (Toggles clearing the variable, used in setvar)
- comment -> cmt (Specifies a comment during check-in)
- checkinoptions -> ciopt (Specifies options for check-in operations)
- oldVersion -> oversion (Specifies the old version of the file)
- refresh -> refresh (Refreshes the autocomplete list, use with dir)
- checkinouttoggle -> checkinouttoggle (Toggles check-in or check-out operations)
- process -> process (Specifies the process to execute)
- list -> list (Lists items based on criteria)
- batch -> batch (Specifies batch operations)
- id -> id (Specifies the ID of the file or folder)
- mkvarattributes -> mkvarattributes (Specifies attributes for variable creation)
- TransitionID -> trid (Specifies the transition ID)
- source -> source (Specifies the source file or folder)
- destroy -> dest (Specifies the destination file or folder)
- recursive -> recursive (Toggles recursive operations)
- extensions -> ext (Specifies file extensions to include)
- ignoreexisting -> ignoreex (Ignores existing files or folders)
- date -> date (Specifies the date)
- updaterefs -> updaterefs (Updates references for files or folders)
- includesubfolders -> includesubfolders (Includes subfolders in the operation)
- includeproperties -> includeproperties (Includes properties in the operation)
- toolboxflag -> toolboxflag (Toggles the toolbox flag)
- evaluatealias -> evaluatealias (Evaluates aliases for dynamic placeholders)
- stringformat -> stringformat (Specifies the string format)
- taskName -> taskName (Specifies the name of the task)
- suffix -> suffix (Specifies a suffix to append)
- prefix -> prefix (Specifies a prefix to prepend)
- includedrawings -> includedrawings (Includes drawings in the operation)
- latest -> latest (Toggles the use of the latest version)

Usage Example:
Full format: setvar -filePath "C:\\Vault\\File.sldprt" -variableName "VariableName" -value "NewValue"
Short format: setvar -f "C:\\Vault\\File.sldprt" -var "VariableName" -val "NewValue"`,
    keywords: ["short format", "abbreviation", "parameter", "shortcut", "alias", "concise", "shorthand"],
    category: "general"
  },
  {
    id: "faq",
    title: "Frequently Asked Questions",
    content: `FAQ for PDMShell:

1. What is PDMShell?
PDMShell is a command-line environment for SOLIDWORKS PDM Professional for automating, querying, and batch processing vault data.

2. Free vs Premium: Free is limited to 5 items per command. Premium is unlimited with workflow integration and scripting.

3. Install/Update: From the official website or Microsoft Store. For updates, uninstall old version first.

4. Why are commands "N/A" after update? Uninstall and reinstall cleanly to refresh command data.

5. Administrative privileges? Yes, required for website installer (MSI). Microsoft Store handles it automatically.

6. System Requirements:
- Windows 10 or 11
- SOLIDWORKS PDM Professional 2014 or newer
- SOLIDWORKS 3D 2017 or newer (for commands using SOLIDWORKS)

7. Report bugs: Email support@bluebyte.biz or use bluebyte.biz/contact.

8. Free version commands: All search-related commands are free (limited to 5 items per run).`,
    keywords: ["faq", "frequently asked questions", "help", "troubleshooting", "install", "update", "requirements", "system", "support"],
    category: "general"
  },
  {
    id: "howtoinstall",
    title: "How to Install/Update PDMShell",
    content: `PDMShell can be installed or updated from the official website or via the Microsoft Store. The website is recommended for the latest version.

Installation Methods:
1. From Website (Recommended): Download from bluebyte.biz.
2. From Microsoft Store: Search for PDMShell and click Install.

Notes:
- Administrative privileges may be required.
- The website always contains the latest version.
- Microsoft Store may require manual reinstall for updates.

Common Update Issues:
After updating, new commands might show up as N/A in the help command. Uninstall and reinstall to reload latest resources.

System Requirements:
- Operating System: Windows 10/11
- SOLIDWORKS PDM Professional: Version 2014 or newer
- SOLIDWORKS 3D: Version 2017 or newer (for SOLIDWORKS-dependent commands)`,
    keywords: ["install", "update", "download", "microsoft store", "website", "setup", "requirements", "windows", "administrator"],
    category: "general"
  },
  {
    id: "runswmacro",
    title: "RUNSWMACRO Command",
    content: `The RunSWMacro command allows you to execute a SOLIDWORKS macro on a specific file or on multiple files found via search in the PDM vault. This is useful for automating repetitive tasks or applying custom logic to many files.

SYNTAX:
runswmacro -filePath -search -recursive -list -skip -count -timeout

PARAMETERS:
- filePath: Path to the SOLIDWORKS macro file (.swp or .dll). This is required and the file needs to be cached in PDM.
- search: Search query to find files to run the macro on.
- recursive: If set, search will include subfolders.
- list: CSV file path of filepaths without a column header.
- skip: Skips the specified number of items. Only valid with list.
- count: Only processes the specified number of items. Only valid with list.
- timeout: Macro timeout in seconds (for both the macro to execute and for SOLIDWORKS to start too).

SOLIDWORKS VERSION:
PDMShell uses the latest SOLIDWORKS version installed on your system by checking the Windows Registry at HKEY_LOCAL_MACHINE\\SOFTWARE\\SolidWorks. If you have multiple versions installed, PDMShell automatically selects the most recent version.

LIST EXAMPLE (CSV without header):
C:\\TestVault\\part1.sldprt
C:\\TestVault\\assembly2.sldasm
C:\\TestVault\\drawing3.slddrw
C:\\TestVault\\bracket4.sldprt

SWP MACRO REQUIREMENTS:
- The macro procedure name must be called main.
- The macro module name must be the file name of the macro appended by 1. Example: If the macro is called print.swp, the module name must be print1.

DLL MACRO REQUIREMENTS:
- The macro class must implement the IPDMShellSOLIDWORKSMacro interface.
- The class must be decorated with the PDMShellMacro attribute.
- The interface is in the NuGet package BlueByte.PDMShell.SOLIDWORKSMacro on nuget.org.
- Must be built against .NET Framework 4.7.2 or higher.

Required NuGet Package Versions:
- BlueByte.PDMShell.SOLIDWORKSMacro version 1.0.0
- BlueByte.SOLIDWORKS.Interops version 2019.0.0
- BlueByte.SOLIDWORKS.PDMProfessional.Interops version 2024.5.50
Using different versions may result in compatibility issues or runtime errors.

Install using Package Manager Console:
Install-Package BlueByte.PDMShell.SOLIDWORKSMacro -Version 1.0.0
Install-Package BlueByte.SOLIDWORKS.Interops -Version 2019.0.0
Install-Package BlueByte.SOLIDWORKS.PDMProfessional.Interops -Version 2024.5.50

DLL Example Implementation (C#):
using PDMShellSOLIDWORKSMacro;
using SolidWorks.Interop.sldworks;
using EPDM.Interop.epdm;

[PDMShellMacro]
public class MyMacro : IPDMShellSOLIDWORKSMacro
{
    public bool Execute(SldWorks swApp, IEdmFile5 pdmFileObject, IEdmFolder5 pdmFolderObject, int handle, string progress, IPDMCmdLineCallback callback, out string error)
    {
        error = string.Empty;
        callback.AppendMessage("Starting macro execution...");
        callback.AppendMessage($"Processing file: {pdmFileObject.Name}");
        callback.AppendMessage("Macro execution completed successfully");
        return true;
    }
}
Use the callback.AppendMessage() method to provide progress updates during macro execution.

EXAMPLES:
runswmacro -filePath "Macros/BatchExport.swp" -search "%.sldprt"
runswmacro -filePath "Macros/MyMacro.dll" -search "%.sldprt" -timeout 12000`,
    keywords: ["runswmacro", "macro", "solidworks macro", "swp", "dll", "automation", "batch", "vba", "execute macro", "nuget", "csharp"],
    category: "scripting"
  },
  {
    id: "releasenotes",
    title: "PDMShell Release Notes",
    content: `Release notes and changelog for PDMShell versions.

IMPORTANT: To update PDMShell properly, download the latest version, uninstall PDMShell and then install the latest version. Do not update the installed version.

3.0.26 (2026-01-05):
- get command: Directory parameter is now optional. If not specified, the file is cached in its folder. If specified with an empty value, the file is cached at the root of the vault.
- Updated tooltip for the source parameter in the clear cache command.

3.0.25 (2025-12-23):
- No added commands or bug fixes. Updated parameters tooltip in addtovault, rename, cd and others.

3.0.24 (2025-12-22):
- Parameter tooltips are now unique for each command.

3.0.23 (2025-12-20):
- Added update references command.

3.0.22 (2025-12-19):
- Added copy command.

3.0.21 (2025-12-18):
- Fixed single instance bug. Commands now executed sequentially.
- Added getoptions in Get.
- Added checkoutoptions in Checkout.

3.0.20 (2025-12-12):
- Fixed timeout issue with Export and RunSwMacro.
- Added name, filePath and value parameters to INBOX.
- source parameter defaults to current directory in addtovault.

3.0.19 (2025-12-11):
- Added winlog parameter for pdmcli.exe. See remarks section of dump command.
- Fixed single instance bug.

3.0.18 (2025-12-08):
- Rebuild. Previous faulty build.

3.0.17 (2025-12-08):
- Fixed single instance issue related to Windows environment variables.
- Added note for solidworks and pdm parameters in the Version command: RESERVED FOR FUTURE. NOT IMPLEMENTED.

3.0.16 (2025-12-07):
- Export: Added timeout parameter for launching SOLIDWORKS.
- RunSwMacro: timeout parameter is also enabled for launching SOLIDWORKS.
- Enforced .pdmshell extension across all commands as the scripting file extension.

3.0.14 (2025-12-05):
- Login: Fix bug with parameter casing.
- Login: Added implementation with the transition command.

3.0.13 (2025-12-04):
- VERSIONUPGRADE: Added a new command.
- VERSIONUPGRADEFROMSOURCE: Added a new command (Reserved but not implemented).

3.0.12 (2025-12-03):
- SetRevisionFromSource: Added a new command.

3.0.11 (2025-12-02):
- SetRevision: Added a new command.
- Fixed evaluation bug: Bracketed variable [Variable] fail to evaluate in name and value parameters.

3.0.10 (2025-12-01):
- Rebuild.

3.0.9 (2025-12-01):
- INFOVAR: Fixed bug related to single flag variables.
- SETVAR: Added support for handling folder cards.

3.0.8 (2025-11-30):
- Fixed unhandled exception when license is limited that causes a crash in all commands.
- Fixed evaluation bug (order).
- Fixed some minor bugs in BOM command.

3.0.7 (2025-11-29):
- BOM: Added a new command.
- Added $configuration placeholder.
- Added release notes page.
- Fixed some minor typos for the delete and destroy commands.
- Changed toolbar icons and tooltips for better UX.`,
    keywords: ["release notes", "changelog", "version", "update", "new features", "bug fix", "history", "3.0"],
    category: "general"
  },
  {
    id: "eula",
    title: "PDMShell End User License Agreement (EULA)",
    content: `End User License Agreement for PDMShell software by Blue Byte Systems Inc.

1. Introduction: This EULA is a legal agreement between you (Licensee) and Blue Byte Systems Inc. (Licensor), governing your use of the PDMShell software product and any associated documentation. By installing, copying, automating, or otherwise using the Software, you agree to be bound by the terms of this EULA.

2. License Grant: Non-exclusive, non-transferable, non-sublicensable, limited right to use the Software on a single computer or device for Licensee's own internal business purposes.

Special Licensing Requirement: Data migration companies, SOLIDWORKS resellers, or third-party providers utilizing or incorporating PDMShell into their commercial services or products must purchase a special licensing model from Blue Byte Systems Inc.

3. Restrictions: Licensee shall not resell, distribute, sublicense, modify, reverse engineer, decompile, disassemble, rent, lease, or use the Software for illegal purposes.

The Software may collect certain metadata about the machine (IP address, SOLIDWORKS version, OS version) for improving the Software and validating licenses.

5. Intellectual Property: All rights owned by Licensor or its licensors. EULA does not grant ownership rights.

6. Termination: Automatically terminates upon breach. Licensor may terminate at any time upon written notice.

7. Disclaimer of Warranty: THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND.

8. Limitation of Liability: LICENSOR SHALL NOT BE LIABLE FOR ANY DAMAGES WHATSOEVER.

9. Changes to Terms: Licensor may modify or update this EULA at any time without prior notice.

10. Governing Law: Governed by laws of British Columbia, Canada.

11. Entire Agreement: This EULA constitutes the entire agreement between the parties.

12. Severability: Invalid provisions shall be struck; remaining provisions remain in effect.

13. Contact: Blue Byte Systems Inc. Email: amen@bluebyte.biz`,
    keywords: ["eula", "license", "agreement", "terms", "legal", "restrictions", "warranty", "liability", "blue byte"],
    category: "general"
  },
  {
    id: "versionupgradefromsource",
    title: "VERSIONUPGRADEFROMSOURCE Command",
    content: `The VERSIONUPGRADEFROMSOURCE command checks and upgrades SOLIDWORKS PDM file versions from a CSV source, performs reference validation, and optionally exports broken references to CSV.

STATUS: This command is reserved but NOT YET IMPLEMENTED. It was added in version 3.0.13 as a placeholder for future functionality.

When implemented, this command will extend the VERSIONUPGRADE command to accept a CSV source file of file paths, similar to how other "fromsource" commands work (e.g., SEARCHFROMSOURCE, SETVARSFROMSOURCE, RENAMEFROMSOURCE).`,
    keywords: ["versionupgradefromsource", "version upgrade", "csv", "source", "not implemented", "reserved", "future"],
    category: "version-control"
  }
];
