export interface DocChunk {
  id: string
  title: string
  content: string
  keywords: string[]
  category: string
}

export const pdmshellDocs: DocChunk[] = [
  {
    id: 'addtovault',
    title: 'ADDTOVAULT Command',
    content: `DESCRIPTION:
The \`addtovault\` command is used to add files and/or directories to the PDM vault. It supports various parameters to specify the source files or directories, search queries, and additional options such as ignoring existing files, updating references, and recursive operations.

It is highly recommended that you run PDMShell as **administrator** before using this command.

SYNTAX:

addtovault -csv  -dir  -search  -source -ignoreex -updaterefs -recursive

PARAMETERS:

- \`csv\`:
(Optional) Specifies the path to a CSV file containing a list of files or directories to be added to the vault.

- \`directory\`:
(Optional)
Specifies the target directory. If not specified current directory is used. If using the current directory, use "".

- \`search\`:
(Optional) A search query to filter files or directories to be added to the vault. This is **File Explorer** search query. Use * as a wildcard.

- \`source\`:
Specifies the source file or directory to be added to the vault. **Default to the current folder in PDM if not specified.**

- \`ignoreex\`:
(Optional) Ignores files that already exist in the vault. This prevents overwriting existing files.

- \`updaterefs\`:
(Optional) Updates references for the files being added to the vault.

- \`recursive\`:
(Optional) Adds all files and subdirectories within the specified directory. This parameter is only applicable when adding directories.

EXAMPLES:

addtovault -source "C:\\Projects\\file.txt" -directory ""
# adds text file to the current directory

REMARKS:

- Use the \`recursive\` parameter with caution, as it will add all contents within the specified directory.
- The \`ignoreex\` parameter prevents overwriting files that already exist in the vault.
- Ensure you have the necessary permissions to add files or directories to the PDM vault.
- Files are left **checked out** after command completes.

Use \`checkin -search % -recursive\` to check in all added files after calling \`addtovault\`.`,
    keywords: ['addtovault', 'csv', 'directory', 'search', 'source', 'ignoreex', 'updaterefs', 'recursive'],
    category: 'file-management'
  },
  {
    id: 'advancedsearch',
    title: 'PDMShell Advanced Search Guide',
    content: `PDMShell provides a complete search engine based on PDM's own search. This feature is extremely useful with commands that have a \`-search\` parameter. 

This guide explains how the \`-search\` parameter works, how to use tokens, variables, operators, and how PDMShell parses and applies search rules.

# Wildcards in PDMShell (SQL-Style Pattern Matching)

PDMShell supports the same wildcard patterns used in SOLIDWORKS PDM and standard SQL-like matching rules. These allow you to control how filenames are matched inside any \`-search\` query.

| Wildcard | Meaning | Example | Result |
|----------|---------|---------|--------|
| \`%\` | Matches **zero or more characters** | \`%.sldprt\` | Returns all part files |
| \`_\` | Matches **exactly one character** | \`pump_.sldprt\` | Matches \`pump1.sldprt\`, \`pumpA.sldprt\`, **not** \`pump10.sldprt\` |

1. Overview

The \`-search\` parameter accepts simple text queries or advanced multi-condition expressions that filter files and folders using PDM system tokens and variable values.

2. Simple Searches

If no operators are present, the entire input is treated as a Name filter.

Examples:  

pump.sldprt     # Searches for files explicitly named pump.sldprt
assembly_1001   # Searches for any file whose name contains 'assembly_1001'
%.sldasm        # Searches for all SOLIDWORKS assembly files in the current folder

Equivalent to: 

\`\`\`bash 
Name=pump.sldprt
Name=passembly_1001
Name=%.sldasm  

3. Advanced Syntax

Multiple conditions are separated using semicolons.

Example:

Name=%Pump%;Recursive=true;VersionsBefore=20200101   # Finds files with 'Pump' in the name, searches subfolders, and only returns versions created before Jan 1st 2020

Dates must follow the \`yyyMMdd\` format.

Escaping rules:  
\`\`\`bash 
\\; inserts a semicolon  
\\= inserts an equals sign  
\\\\ inserts a literal backslash

Example:  

Name=Valve\\=A;Label=Released\\;Approved   # Searches for files literally named "Valve=A" and having a label containing the text "Released;Approved"

4. Built-in Search Tokens

These tokens map directly to EdmSearchToken values and control how PDMShell filters PDM objects.

### Table: Supported Search Tokens

| Token | Description |
|-------|-------------|
| Name | File or folder name filter |
| AllVersions | Search all versions |
| ContentText | Full-text content search string |
| ContentTextExact | Exact match of content |
| ContentTextInBody | Search inside file body |
| ContentTextInProperties | Search in custom properties |
| ContentTextOr | Match any word |
| FindFiles | Include files in results |
| FindFolders | Include folders in results |
| FindItems | Include items in results |
| FolderID | Starting folder ID |
| HistoryAfter | Search history after date |
| HistoryBefore | Search history before date |
| HistoryString | History string search |
| HistoryStringConfiguration | Search configuration names |
| HistoryStringFileName | Search file names in history |
| HistoryStringLabels | Search labels in history |
| HistoryStringRevisionComment | Search revision comments |
| HistoryStringStateComment | Search state change comments |
| HistoryStringVariableValues | Search variable changes |
| HistoryStringVersionComment | Search version comments |
| Label | Search label text |
| LabelAfter | Labels after date |
| LabelBefore | Labels before date |
| LabelByUser | Labels created by user |
| LabelComment | Search label comment |
| Locked | Return checked-out files |
| LockedBy | Return files locked by user |
| Recursive | Include subfolders |
| StateAfter | State changes after date |
| StateBefore | State changes before date |
| StateByUser | User who changed state |
| StateHistoric | Search historic states |
| StateID | Workflow state ID |
| StateName | Workflow state name |
| Unlocked | Return checked-in files |
| VersionComment | Search version comment |
| VersionsAfter | Versions after date |
| VersionsBefore | Versions before date |
| VersionsByUser | Versions created by user |
| WorkflowName | Search by workflow name |
| **DuplicatedBy** | **Finds duplicates either by name, variables, hash and filedate** |

#### Duplicates

You can use \`DuplicatedBy\` to list the items either filename, variable, ash or last date the file was modified. To use the hash, files must be locally cached. 

# finds all solidworks duplicate solidworks files by name and list their file date, hash and revision variable
search -search "Name=%.sld%;Recursive=true;DuplicatedBy=Name" -columns "FileDate,Hash,Revision"

# finds all solidworks duplicate solidworks files by revision and list their file date, hash and revision variable
search -search "Name=%.sld%;Recursive=true;DuplicatedBy=@Revision" -columns "FileDate,Hash,Revision"

5. Default Behavior

\`FolderID\` defaults to the active directory.  
\`Recursive\` defaults to the global flag.  
\`FindFolders\` defaults to the includefolders flag.  
\`FindFiles\` is always true.

6. Variable Search

Conditions beginning with @ use PDM variables.

Format: 
\`\`\`bash  
@VariableName Operator Value

Examples:  

@Description=Pump      # Variable 'Description' must equal "Pump"
@Weight>=10            # Numeric variable 'Weight' must be greater than or equal to 10
@Revision!=A           # Variable 'Revision' must NOT be "A"
@Material~Steel        # Variable 'Material' must contain the text "Steel"
@ProjectCode!~TEST     # Variable 'ProjectCode' must NOT contain the text "TEST"

You can chain mutiple variables. The chain of variables uses the AND operator:

@Description=Pump.sldprt;@Weight>=10      # Part files named pump that have weight above 10

7. Supported Variable Operators

PDMShell supports all major comparison operators for variables.

### Table: Supported Operators

| Symbol | Meaning |
|--------|---------|
| = | Equal |
| != | Not equal |
| <> | Not equal |
| > | Greater than |
| < | Less than |
| >= | Greater or equal |
| <= | Less or equal |
| ~ | Contains |
| !~ | Does not contain |

8. Variable Operator-to-Enum Mapping

### Table: String Variable Operator Mapping

| Symbol | Enum |
|--------|------|
| = | Equals |
| != / <> | Different |
| > | Greater |
| < | Less  |
| >= | Greater or equal |
| <= | Less or equal |
| ~ | Contains |
| !~ | Not contains |

### Numeric and date types use the corresponding numeric/date enum sets.

Dates must be in the format: yyyyMMdd

9. Operator Detection

Operators are detected longest-first to avoid ambiguity.

### Table: Operator Detection Order

| Order | Operator |
|-------|----------|
| 1 | >= |
| 2 | <= |
| 3 | != |
| 4 | <> |
| 5 | !~ |
| 6 | ~ |
| 7 | > |
| 8 | < |
| 9 | = |

This ensures >= is not incorrectly parsed as >.

10. Combining Tokens and Variables

Tokens and variable conditions can be mixed:

Name=%Pump%;@Description~Steel;StateName=Released;@Weight>=5   # Files with names containing 'Pump', description containing 'Steel', state equal to Released, and weight >= 5

All conditions must match.

11. Invalid Input Handling

Invalid expressions are ignored silently. PDMShell continues applying valid conditions.

Examples ignored:
\`\`\`bash 
@MissingVar=Test  
HistoryBefore=BADDATE  
UnknownKey=Value  

12. Examples

Search by name:

Name=%Valve%
# Finds all files whose name contains 'Valve'

Search by folder:

Name=%Valve%;FolderID=102          
# Same search, but restricted to folder with ID 102

Variable contains:

@Description~Pump                
# Matches files where Description contains the text 'Pump'

Token and variable together:

StateName=Approved;@Revision!=A  
# Files in state 'Approved' AND Revision variable not equal to 'A'

More complex:

Name=%Pump%;@Material~Steel;@Weight>=15;Recursive=true;VersionsBefore=20200101
# Files with 'Pump' in the name, Material containing 'Steel', Weight >= 15,
# include subfolders, and versions created before Jan 1st 2020

13. Technical support

Please reach out to us if you have a premium license or considering getting one from our contact [page](https://bluebyte.biz/contact) on our main website.`,
    keywords: ['advancedsearch', 'pdmshell', 'advanced', 'search', 'guide'],
    category: 'search'
  },
  {
    id: 'bom',
    title: 'BOM Command',
    content: `DESCRIPTION:

The \`BOMCommand\` allows you to extract a Bill of Materials from a SOLIDWORKS file inside the PDM vault and export it to a CSV file.  
This command supports configuration evaluation using **$configuration**, allows specifying **configNames**, and supports selecting a **layout** from all available BOM layouts.

SYNTAX:

bom -filePath -name -directory -configNames -layout

PARAMETERS:

- \`filePath\`  
  Path to the SOLIDWORKS file whose BOM you want to export.

- \`name\`  
  The base name for the exported CSV file.  
  Supports evaluation (e.g., \`$configuration\`).  
  [More information here](EVAL.md).

- \`directory\`  
  Target folder where the CSV will be saved.

- \`configNames\`  
  Comma-separated list of configurations to extract the BOM from. If unspecified, all configurations are processed. 
  Example: \`@,Default,Manufacturing\`.

- \`layout\`  
  A comma-separated list of BOM layout names to export.  
  Example: \`Engineering,Manufacturing\`.  
  PDMShell validates layout names against PDM before exporting.`,
    keywords: ['bom'],
    category: 'export'
  },
  {
    id: 'cd',
    title: 'CD Command',
    content: `DESCRIPTION:
Changes the current PDM directory.

SYNTAX:

cd [-directory|-id]

PARAMETERS:
-\`directory\`(or \`d\`): The directory to switch to. The directory parameter can be a relative or absolute path in PDM.
-\`id\`: ID of the folder to navigate to.

EXAMPLES:

cd -directory 'C:\\Vault\\NewFolder' # Navigates its newFolder

REMARKS:
- Please be aware of the following special ways to change directory:

cd.. # Navigates to the parent folder
cd\\  # Navigates to the root of the vault

- If the user just created a new folder and wants to \`cd\` to it using autocomplete, they need to use the \`dir\` command with the \`-refresh\` parameter to force the session to load the current files and sub-folders in the active directory. Using \`-refresh\` might affect the performance of the session if the current folder has too many files and sub-folders.
- \`directory\` is the default parameter. You do not need to specify it if it is the only parameter in your command. 
Example: 

cd api #navigates to the api folder
cd -id 755 #navigates to the folder with id 755

TUTORIAL:
 <video src="https://bluebyte.biz/wp-content/pdmshellvideos/cd.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>`,
    keywords: ['cd', 'directory', 'id'],
    category: 'navigation'
  },
  {
    id: 'checkin',
    title: 'CHECKIN Command',
    content: `DESCRIPTION:
Performs a check-in operation on a specified file or many files.

SYNTAX:

checkin -search -filePath -comment -Checkinoptions

PARAMETERS:
- \`search\`: The search operation to use.

- \`filePath\`: The file(s) to be checked in. This is the default parameter.

- \`comment\`: The comment to add to the check-in.

- \`Checkinoptions\`: The check-in options to use.

EXAMPLES:

checkin -filePath "file1.sldprt"

REMARKS:
- The search parameter searches the current directory and does not drill down. The search query is a PDM one, so you can use \`%\` for wildcard.
- If combining \`Checkinoptions\` parameters, the user needs to add \`+\` between the values.

### Checkinoptions Parameter Values:

| Member                                    | Description                                                                                                      |
|-------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| EdmUnlock_FailOnRegenerationNeed          | Fail if the file needs to be regenerated in the CAD program. NOTE: Only files resaved in SOLIDWORKS 2009 or later can trigger this flag |
| EdmUnlock_ForceUnlock                     | Unlock the file even if it is not modified                                                                       |
| EdmUnlock_IgnoreCorruptFile               | Ignore files with file formats unrecognized by SOLIDWORKS PDM Professional; without this flag, SOLIDWORKS PDM Professional returns E_EDM_INVALID_FILE if it encounters a corrupt file or a file containing a newer format than SOLIDWORKS PDM Professional can handle |
| EdmUnlock_IgnoreReferences                | Silently unlock parent files without their references                                                            |
| EdmUnlock_IgnoreRefsNotLockedByCaller     | Ignore references not locked by caller                                                                           |
| EdmUnlock_IgnoreRefsOutsideVault          | Ignore references to files outside the vault                                                                     |
| EdmUnlock_KeepLocked                      | Keep the file checked out after creating the new version in the archive                                          |
| EdmUnlock_OverwriteLatestVersion          | Do not create a new version; overwrite the last version of the file with new changes                             |
| EdmUnlock_RemoveLocalCopy                 | Remove the local copy of the file from the hard disk after the file has been checked in                          |
| EdmUnlock_Simple                          | Check in the file using default behavior                                                                         |`,
    keywords: ['checkin', 'search', 'filepath', 'comment', 'checkinoptions'],
    category: 'version-control'
  },
  {
    id: 'checkout',
    title: 'CHECKOUT Command',
    content: `DESCRIPTION:
Performs a check out operation on a specified file or many files.

SYNTAX:

checkout -search -recursive -filePath

PARAMETERS:
-\`search\`: Search keyword

-\`filePath\`: The file(s) to be checked out. This is the default parameter

-\`recursive\`: Recursively check out all files in the current directory. Use in combination with search

-\`checkoutoptions\`: Optional. Use this to check a file and its references at once:

| Option Name (CLI)              | Description |
|--------------------------------|-------------|
| Nothing                        | No checkout options are applied. |
| AsBuilt1                       | Uses the same versions of referenced files that were used when the referencing file was checked in; otherwise, the latest versions are used. |
| SkipUnlockedWritable           | Does not retrieve files that are writable and not checked out. |
| SkipExisting                   | Does not retrieve files that already exist in the local cache. |
| ForPreview                     | Retrieves only referenced files required for preview; skips caching referenced files. |
| RefreshFileListing             | Refreshes the File Explorer listing after files have been checked out. |
| LockReferencedFilesToo         | Checks out (locks) files referenced by the checked-out file. |
| AsBuiltNotDefault              | Uses the as-built versions when creating the reference tree. |
| SkipOpenFileChecks             | Skips checking whether files are open in another application. |
| SkipLockRefFiles               | Skips checking of lock file references. |
| LockNoLclCopyFiles             | Locks referenced files even if no local cache copy exists. |
| IncludeAutoCacheFiles          | Automatically caches referenced files if the latest version is not already in the local cache. |
| RollbackTree                   | Provides the ability to roll back files in the checkout dialog. |
| ForViewer                      | Retrieves only referenced files required by the viewer; skips caching referenced files. |
| SingleFileRollback             | Rolls back a single file. |
| XrefsOpenCheck                 | Checks whether cross-reference files are open in another application. |

You combine values by using \`+\`. Please make sure to wrap the parameter value in "". Example: \`"SkipExisting + LockReferencedFilesToo"\`

EXAMPLES:

checkout -filePath file1.sldprt

REMARKS:
- The search parameter searches the current directory and does not drill down. The search query is a PDM one, so you can use \`%\` for wildcard.

TUTORIAL:
 <video src="https://bluebyte.biz/wp-content/pdmshellvideos/checkout.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>`,
    keywords: ['checkout', 'search', 'filepath', 'recursive', 'checkoutoptions'],
    category: 'version-control'
  },
  {
    id: 'clearcache',
    title: 'CLEARCACHE Command',
    content: `DESCRIPTION:
Clears the local cache of a folder or many files.

SYNTAX:

clearcache -directory -search -toolboxflag -source

PARAMETERS:
- \`-directory\`: The directory to clear the local cache of.
- \`-search\`: Search query.
- \`-toolboxflag\`: Ignore toolbox files.
- \`-source\`: CSV files containing complete local file paths to clear. First row is header.

EXAMPLES:

clearcache -search "*.sldprt"
# Clears the cache of all \`.sldprt\` files in the current directory.

clearcache -directory project -toolboxflag
# Clears the directory called project whiling ignore toolbox files.

clearcache -source "source.csv"
# Clears the cache for the specified source.`,
    keywords: ['clearcache'],
    category: 'system'
  },
  {
    id: 'cls',
    title: 'CLS Command',
    content: `DESCRIPTION:
Clears the current session.

SYNTAX:

cls

PARAMETERS:

Command has no parameters.

EXAMPLES:

cls

REMARKS
- You can alternatively set the Line Limit Count from the settings to remind the session to clear every count of lines.`,
    keywords: ['cls'],
    category: 'system'
  },
  {
    id: 'copy',
    title: 'COPY Command',
    content: `DESCRIPTION
Performs a vault-to-vault copy operation in SOLIDWORKS PDM.

The \`copy\` command creates **new files with new File IDs** inside the vault by copying:
- A single file
- All files in a folder
- Files found using a search scoped to a source folder

This command does **not** add files from disk and does **not** modify the original files.

SYNTAX

copy -source -directory -search -recursive -name -ignoreexisting

PARAMETERS

- \`source\`  
  The source file or folder inside the vault.  
  - If a file path is provided (ends with an extension), only that file is copied.
  - If a folder path is provided, all matching files in that folder are copied.
  - Relative paths are resolved against the current folder.

- \`directory\`  
  The destination folder inside the vault where files will be copied.

- \`search\`  
  Optional PDM search keyword used to filter files in the source folder.  
  The search is scoped to the source folder and supports \`%\` wildcards.

- \`recursive\`  
  Optional. When used with \`search\`, includes subfolders of the source folder.

- \`name\`  
  Required. Specifies the destination file name.  
  [Alias expressions are evaluated **only for the destination name**](EVAL.md). Extension required.

- \`ignoreexisting\`  
  Not implemented

EXAMPLES

### Copy a single file to another folder

copy -source part1.sldprt -directory /Vault/Projects/Released -name part2.sldprt

### Copy a file and rename it

copy -source part1.sldprt -directory /Vault/Projects/Released -name part1_revA.sldprt

### Copy all files from a folder

copy -source Vault/Projects/WIP -directory /Vault/Projects/Released -name "$namewithouextension-new$extension"

### Copy files using a search filter

copy -source Vault/Projects/WIP -search %.slddrw -directory Vault/Projects/Released -name "$namewithouextension-new$extension"

### Copy files and append new to the old name

copy -source Vault/Projects/WIP -search %.sldprt -directory Vault/Projects/Released -name "$namewithouextension-new$extension"

REMARKS

- If \`source\` is a file, \`search\` and \`recursive\` are ignored.
- If \`source\` is a folder and \`search\` is not provided, all files in that folder are copied.
- The \`search\` parameter does not search the entire vault, only the source folder`,
    keywords: ['copy'],
    category: 'file-management'
  },
  {
    id: 'copytree',
    title: 'COPYTREE Command',
    content: `DESCRIPTION:
The \`copytree\` command is used to copy files and their associated metadata from a source directory or search results, with options to apply prefixes, suffixes, and other filters. This only works with assembly files.

SYNTAX:

copytree [-search|-filePath] -suffix -prefix -recursive -includedrawings -latest -directory

PARAMETERS:
- \`-filePath\`: The source file or directory to copy.  
- \`-directory\`: Specifies the target directory where the files will be copied.  
- \`-search\`: A search query to filter files to be copied.  
- \`-suffix\`: Adds a suffix to the copied files.  
- \`-prefix\`:  Adds a prefix to the copied files.  
- \`-recursive\`: Copies files recursively from subdirectories.  
- \`-includedrawings\`: Includes associated drawing files in the copy operation.  
- \`-latest\`: Ensures the latest version of the files is copied.

EXAMPLES:
 \`\`\`bash
   copytree -filePath "fidget spinner.sldasm" -suffix _ -directory "\\new project" #copies the fidget spinner to new project folder with suffix _
   copytree -search "*.sldasm" -includedrawings -directory "c:\\export" #copies all assemblies in current directory to the export under c drive
   \`\`\`

REMARKS:
- The \`-dir\` parameter specifies the target directory. If omitted, the current directory is used.
- Use the \`-recursive\` parameter to include all subdirectories in the operation.
- The \`-includedrawings\` parameter ensures that associated drawing files are included in the copy.
- The \`-latest\` parameter ensures that only the latest versions of files are copied.`,
    keywords: ['copytree'],
    category: 'file-management'
  },
  {
    id: 'delete',
    title: 'delete all parts in the current directory',
    content: `# DELETE Command Documentation

DESCRIPTION:
The \`delete\` command is used to delete files or directories from the PDM system. It supports various parameters to specify the target files or directories, including file paths, directory paths, search queries, and IDs. The command also supports recursive deletion for directories.

SYNTAX:

delete [-filePath|-id] -directory -search -recursive -list -csv

PARAMETERS:

- \`filePath\`:
(Optional) Specifies the file path of the file to be deleted.

- \`directory\`: 
(Optional) Specifies the directory to be deleted. If used with the -recursive parameter, all files and subdirectories within the directory will also be deleted.

- \`search\`:
(Optional) A search query to filter files or directories to be deleted.

- \`id\`:
(Optional) Specifies the ID of the file to be deleted.

- \`recursive\`:
(Optional) Deletes all files and subdirectories within the specified directory. This parameter is only applicable when deleting directories.

- \`list\`:
(Optional) Lists all the deleted files. Specifying \`recursive\` with this parameter will do a drill down search and fetch all deleted files.

- \`csv\`: Exports a list of deleted files to a csv. This only works if \`list is specified\`. 

- \`destroy\`: If specified, the deleted file will be also destroyed. \`-destroy\` only affects results from the \`search\` parameter.

Use the exported csv from -csv with the [recover](RECOVER.html) command.

 \`-destroy\` only affects results from the \`search\` parameter. 

EXAMPLES:
Delete files matching a search query:

delete -search "%.sldprt"

REMARKS:
- The delete command requires at least one of the following parameters: \`filePath\`, \`dir\`, \`search\`, or \`id\`.
- Use the \`recursive\` parameter with caution, as it will delete all contents within the specified directory.
- Ensure you have the necessary permissions to delete files or directories in the PDM system.

TUTORIAL:
 <video src="https://bluebyte.biz/wp-content/pdmshellvideos/delete.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>`,
    keywords: ['delete', 'all', 'parts', 'current', 'directory', 'filepath', 'search', 'id', 'recursive', 'list', 'csv', 'destroy'],
    category: 'file-management'
  },
  {
    id: 'deletefromsource',
    title: 'DELETEFROMSOURCE Command',
    content: `DESCRIPTION:

The \`deletefromsource\` command deletes files listed in a CSV file. It can also optionally destroy the files and export the operation results to a CSV file for auditing and reporting purposes.

SYNTAX:

    deletefromsource -filePath -destroy -csv -batch

PARAMETERS:

| Parameter | Type | Required | Description |
|---|---|---|---|
| \`filePath\` | string | Yes | Path to the source CSV file containing File IDs and Folder IDs. |
| \`destroy\` | flag | No | If specified, files will be permanently destroyed after deletion. |
| \`csv\` | string | No | Path to export the results CSV file. |
| \`batch\` | int | No | Destory batch size for large folders. |
SOURCE CSV FORMAT:

The source CSV file must contain a header row with the following columns:

FileID,FolderID
12345,678
12346,678

| Column | Description |
|---|---|
| FileID | The document ID of the file |
| FolderID | The folder ID containing the file |

RESULTS CSV FORMAT:

If \`-csv\` is specified, PDMShell will generate a results file containing:

FileID,FolderID,Deleted,Destroyed,DeleteError,DestroyError
12345,678,True,True,,
12346,678,False,False,File is checked out,

RESULTS CSV COLUMNS:

| Column | Description |
|---|---|
| FileID | File ID |
| FolderID | Folder ID |
| Deleted | Whether delete succeeded |
| Destroyed | Whether destroy succeeded |
| DeleteError | Delete error message if failed |
| DestroyError | Destroy error message if failed |

REMARKS:

- The source file **must be a CSV file with a header row**.

EXAMPLES:

Delete files from CSV:
deletefromsource -filePath "files to delete.csv"

##Delete and destroy files:
deletefromsource -filePath "files to delete.csv" -destroy

Delete, destroy, and export results:
deletefromsource -filePath "files to delete.csv" -destroy -csv "results.csv"

Delete, destroy (50 files at a time in each folder), and export results:
deletefromsource -filePath "files to delete.csv" -destroy -csv "results.csv" -batch 50`,
    keywords: ['deletefromsource', 'filepath', 'destroy', 'csv', 'batch'],
    category: 'file-management'
  },
  {
    id: 'destroy',
    title: 'DESTROY Command',
    content: `DESCRIPTION:
The \`destroy\` command is used to permanently delete files that have been marked as deleted in a specified directory. This command supports recursive deletion and filtering by date.

SYNTAX:

destroy -directory -recursive -date 

PARAMETERS:

- \`directory\`: The directory to destroy.
- \`recursive\`: Enables recursive search (for files).
- \`date\`: (Optional) Specifies a date filter. Only files deleted on or before the specified date will be destroyed. The date format should be YYYY-MM-DD.

EXAMPLES:

destroy -directory "C:\\Projects\\Project"
# destroys all deleted files in project folder

REMARKS:

- The \`directory\` parameter is mandatory and must specify a valid directory.
- Use the \`recursive\` parameter with caution, as it will process all subdirectories within the specified directory.
- The \`date\` parameter allows you to target files deleted on or before the specified date, providing more control over the destruction process.
- This action is irreversible. Ensure you have the necessary permissions and have reviewed the files before executing the command.

TUTORIAL:
<video src="https://bluebyte.biz/wp-content/pdmshellvideos/destroy.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>`,
    keywords: ['destroy', 'directory', 'recursive', 'date'],
    category: 'file-management'
  },
  {
    id: 'dir',
    title: 'DIR Command',
    content: `DESCRIPTION:
Displays a list of files and subdirectories in a directory.

SYNTAX:

dir -sort -columns -csv -refresh

PARAMETERS:

-\`sort\`: The column name to sort the list of files and folders with.

-\`columns\`: The columns to display, separated by commas. These are PDM variables drawn from the @ tab.

-\`csv\`: Export the directory listing to a CSV file. Must include the csv extension

-\`refresh\`: Refreshes the session to load the current files and sub-folders in the active directory in the autocomplete list.

-\`recursive\`: Lists all files and all folders in the current directory recursively. 

EXAMPLES:

dir  #"C:\\Vault\\Documents"
dir  -sort "name" -cols "description,partnumber" -csv "output.csv" -refresh

REMARKS:

- Use the \`-refresh\` parameter to force the session to load the current files and sub-folders in the active directory. Do not use this when the current folder has many items.
- The CSV file will be checked into the current directory.

TUTORIAL:
 <video src="https://bluebyte.biz/wp-content/pdmshellvideos/dir.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>`,
    keywords: ['dir', 'sort', 'columns', 'csv', 'refresh', 'recursive'],
    category: 'navigation'
  },
  {
    id: 'dispatch',
    title: 'Notes About Running PDMShell Scripts from Dispatch',
    content: `When you want to run PDMShell scripts from Dispatch, you can use the **Shell Command** action.

Shell Command Settings

![dispatchwindow](../images/dispatchwindow.png)

1. **Verb**: Leave this field empty.
2. **Filename**: Specify the path to the PDMShell executable, which is \`pdmcli.exe\`.  
 > Do not wrap the path in quotes (\`""\`), even if it contains spaces.

3. **Parameters**: Use the following format:  
   \`\`\`bash
   runscript "pathToScript" [additional parameters]
   \`\`\`

- The pathToScript must be wrapped in quotes ("") if it contains spaces.
- Additional parameters can be passed to the script as needed.

Example: Dispatch Shell Execute Configuration

Verb: #leave this empty
Filename: C:\\Program Files (x86)\\BLUE BYTE SYSTEMS INC\\PDMShell\\PDMCLI.exe
Parameters: runscript "C:\\Scripts\\frogleap.pdmshell" "%PathToSelectedFile%" "%OldVersion%"

Example Script:

In the PDMShell script (frogleap.pdmshell), you can reference the parameters as follows:

\`\`\` bash
# check selected file out
checkout -filePath "$parameter1$"
# frogleap version to specified version 
frogleap -filePath "$parameter1$" -oldVersion "$parameter2$"
# save changes
checkin -filePath "$parameter1$" -comment "prompted version $parameter2$"
# you must call this
quit

Tutorial
 <video src="https://bluebyte.biz/wp-content/pdmshellvideos/dispatch.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>

Tips for Running PDMShell Scripts from Dispatch
- Test Your Scripts: Always test your PDMShell scripts independently before integrating them with Dispatch.
- Use Quotes for Paths: Wrap paths and parameters in quotes ("") if they contain spaces to avoid errors.`,
    keywords: ['dispatch', 'notes', 'about', 'running', 'pdmshell', 'scripts'],
    category: 'scripting'
  },
  {
    id: 'docmanprops',
    title: 'DOCMANPROPS Command',
    content: `DESCRIPTION

The \`docmanprops\` command is used to **export and refresh SOLIDWORKS file custom properties** without opening SOLIDWORKS.

This command supports two primary modes:

- **Export Mode (Default)** — Reads properties from SOLIDWORKS files and writes them to a CSV file
- **Refresh Mode** — Reads a CSV file and writes the properties back into the SOLIDWORKS files (Same CSV from Export mode)

---

# SYNTAX

docmanprops -directory <path> -csv <csvPath> [-recursive] [-configNames] [-refresh]

---

# PARAMETERS

directory

Specifies the folder containing SOLIDWORKS files.

Supported file types:

- .sldprt
- .sldasm
- .slddrw

Example: \`-directory "C:\\Vault\\Projects"\`

---

csv

Specifies the CSV file path.

Used for:

- Export destination
- Refresh source

Example: \`-csv "C:\\temp\\props.csv"\`

---

refresh

When specified, the command runs in **Refresh Mode**.

Reads the CSV file and writes the properties back into the SOLIDWORKS files.

---

recursive

When specified, searches subfolders.
---

configNames

Specifies which configurations to include.

Default: All configurations

Example: \`-configNames "Default,Config1"\` Use space for custom property.

---

# CSV FORMAT

The CSV contains the following columns:

Folder  
FullPath  
FileName  
Extension  
Configuration  
Property  
Value  
EvaluatedValue  
Type  
Success  
Exception  

Example:

C:\\Vault\\Part, C:\\Vault\\Part\\Part1.SLDPRT, Part1, .SLDPRT, Default, Description, Plate, Plate, Text, True,

---

# EXPORT MODE

DESCRIPTION

Reads properties from files and writes them to CSV.

Properties include:

- File custom properties
- Configuration properties
- Evaluated values
- Property types

---

EXAMPLE

docmanprops -directory "C:\\Vault\\Parts" -csv "C:\\temp\\props.csv" -recursive

OUTPUT
![export mode](/images/exportmode.png)
---

# REFRESH MODE

DESCRIPTION

Reads CSV file and writes properties back into files.

Features:

- Opens each file once
- Updates all properties
- Saves file
- Updates CSV Success and Exception columns
- Parallel processing

Implementation reference: :contentReference[oaicite:1]{index=1}

---

EXAMPLE

docmanprops -csv "C:\\temp\\props.csv" -refresh

OUTPUT
![refreshmode](/images/refreshmode.png)

---

# SUCCESS AND ERROR TRACKING

The CSV is updated during refresh:

Success column:

True — Property updated successfully  
False — Property update failed  

Exception column:

Contains error message

Example:

Property,Success,Exception
Description,True,
PartNumber,False,Configuration Default not found

---

# PERFORMANCE

Typical performance:

| Files | Time |
|---|---|
| 1,000 | seconds |
| 10,000 | under 1 minute |
| 100,000 | few minutes |

---`,
    keywords: ['docmanprops'],
    category: 'general'
  },
  {
    id: 'dump',
    title: 'DUMP Command',
    content: `DESCRIPTION:
Dumps all session text into a log file and check it back into the vault.

SYNTAX:

dump filePath

PARAMETERS:

- \`filePath\`: The log file to dump session details into.

EXAMPLES:

dump -filePath "$release_script_$yyyy_$mm_$dd_$guid.txt"

REMARKS:

- To make sure your logs are always unique, use \`$guid\` or the date/time place holders. You can get more information about these place holders [here](/src/EVAL.html).

- If you start PDMShell as a Windows administrator with the \`-winlog\` or \`/winlog\` parameter, PDMShell will create logs in the Windows event viewer.`,
    keywords: ['dump', 'filepath'],
    category: 'system'
  },
  {
    id: 'editvars',
    title: 'EDITVARS Command',
    content: `DESCRIPTION:
Opens the PDM variable editor.

SYNTAX:
\`\`\`bash 
editvars

PARAMETERS:
None

EXAMPLES:

editvars
# open the PDM variable editor 

TUTORIAL:
![Variable Editor Manager](../images/editvars.png)`,
    keywords: ['editvars'],
    category: 'variables'
  },
  {
    id: 'escapingquotes',
    title: 'This runs the command: help -command "checkout" (See above)',
    content: `### When calling from **command line (cmd.exe or Dispatch):**
---
#### Example 1:
![escapequotescommandline](../images/escapequotecommandline.png)

Using \`\\"\` in \`cmd.exe\` will actually produce " in the PDMShell session:

pdmcli.exe /single help -command \\"checkout\\" 

#### Example 2:

Using \`\\\\\\""\` in \`cmd.exe\` will actually produce \`\\"\` in the PDMShell session command box which in turn gets evaluated as \`"\` once executed:

![escapequotescommandline](../images/escapequotecommandline_1.png)

pdmcli.exe /single setvar -filePath membrane.sldprt -variableName Description -value \\" 1 \\\\\\"" 3\\"

will produce:

# >setvar -filePath membrane.sldprt -variableName Description -value "1 \\" 3"
# >@: Set Description to 1 " 3
# \\" in PDMShell session evaluates to "

### When calling from **PDMShell regular session:**
---
To escape \`"\`, use this \`\\"\`:

setvar -filePath membrane.sldprt -VariableName Description -value "3/1"
# @: Set Description to 3/1
setvar -filePath membrane.sldprt -VariableName Description -value "3/\\"1"
# @: Set Description to 3/"1
# \\" escape " in a regular session`,
    keywords: ['escapingquotes', 'this', 'runs', 'help', 'checkout', 'see', 'above'],
    category: 'scripting'
  },
  {
    id: 'eula',
    title: 'End User License Agreement',
    content: `1. Introduction

This End User License Agreement (**"EULA"**) is a legal agreement between you (**"Licensee"**) and **Blue Byte Systems Inc. ("Licensor")**, governing your use of the **PDMShell** software product and any associated documentation (collectively, the **"Software"**). By installing, copying, automating (including automatic or unattended use), or otherwise using the Software, you agree to be bound by the terms of this EULA. If you do not agree, do not install, copy, automate, or otherwise use the Software.

2. License Grant

Licensor grants Licensee a non-exclusive, non-transferable, non-sublicensable, limited right to use the Software on a single computer or device for Licensee’s own internal business purposes.

**Special Licensing Requirement:**  
Data migration companies, SOLIDWORKS resellers, or third-party providers utilizing or incorporating PDMShell into their commercial services or products **must** purchase a special licensing model from Blue Byte Systems Inc. Use without acquiring such licensing is strictly prohibited.

3. Restrictions

Licensee agrees not to, and shall not permit others to:

- Resell, distribute, or sublicense the Software to any third party.
- Modify, adapt, translate, or create derivative works of the Software.
- Reverse engineer, decompile, disassemble, or otherwise attempt to derive the source code of the Software.
- Rent, lease, lend, or otherwise transfer the Software to any third party.
- Use the Software for any illegal purpose or in violation of applicable law.

To improve our software and validate licenses, the Software may collect certain metadata about the machine it is installed on, including but not limited to the IP address, SOLIDWORKS version, and operating system version. This information is used solely for the purposes of enhancing the Software and ensuring compliance with licensing terms. By using the Software, you consent to this data collection.

5. Intellectual Property

The Software and all related intellectual property rights, including copyrights, patents, trademarks, and trade secrets, are owned by Licensor or its licensors. This EULA does not grant Licensee any ownership rights in the Software.

6. Termination

This EULA shall automatically terminate upon Licensee’s breach of any of its terms. Licensor may also terminate this EULA at any time upon written notice to Licensee. Upon termination, Licensee shall cease all use of the Software and delete all copies of the Software from its systems.

7. Disclaimer of Warranty

THE SOFTWARE IS PROVIDED **"AS IS"** WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. LICENSOR DOES NOT WARRANT THAT THE SOFTWARE WILL BE ERROR-FREE OR THAT IT WILL MEET LICENSEE’S REQUIREMENTS.

8. Limitation of Liability

IN NO EVENT SHALL LICENSOR BE LIABLE FOR ANY DAMAGES WHATSOEVER, INCLUDING WITHOUT LIMITATION, DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, ARISING OUT OF THE USE OF OR INABILITY TO USE THE SOFTWARE, EVEN IF LICENSOR HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

9. Changes to Terms

Licensor reserves the right, in its sole discretion, to modify or update this EULA at any time **without prior notice**. Continued use of the Software constitutes acceptance of the modified or updated terms.

10. Governing Law

This EULA shall be governed by and construed in accordance with the laws of British Columbia, Canada, without regard to its conflict of law provisions.

11. Entire Agreement

This EULA constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior or contemporaneous communications, representations, and agreements, whether oral or written.

12. Severability

If any provision of this EULA is held to be invalid or unenforceable, such provision shall be struck, and the remaining provisions shall remain in full force and effect.

13. Contact Information

For any questions regarding this EULA, please contact:

**Blue Byte Systems Inc.**  
Email: [amen@bluebyte.biz](mailto:amen@bluebyte.biz)`,
    keywords: ['eula', 'end', 'user', 'license', 'agreement'],
    category: 'general'
  },
  {
    id: 'eval',
    title: 'Dynamic Placeholders in PDMShell',
    content: `Overview

The **Dynamic Placeholders** feature in PDMShell allows you to substitute values dynamically using placeholders. This functionality is supported by several commands and enables the use of file or folder properties, system variables, and other contextual information to generate new values automatically.

Dynamic Placeholders are not a standalone command but a **feature** used by specific commands to process the \`value\` parameter or other relevant inputs.

---

Commands Supporting Dynamic Placeholders
The following commands support the use of dynamic placeholders:

### Commands Using the Current Folder as the Backing Object (\`directory\` parameter):
- **\`cd\`**: Change the current directory.
- **\`mkdir\`**: Create a new directory.
- **\`export\`**: Export commands to a file.
- **\`addtvault\`**: Add a vault with the directory as the backing object.

### Commands Using Files or Folders as the Backing Object:
- **\`rename\`**: Uses the \`value\` parameter for renaming files or folders.
- **\`renamefromsource\`**: The new file is evaluated if the \`evaluatealiases\` parameter is specified.
- **\`setvar\`**: Uses the \`value\` parameter to set variables for files or folders.
- **\`bom\`**: Uses the \`name\` parameter to set the exported bom csv name.
- **\`export\`**: Uses the \`name\` parameter to set the exported files name pattern.

---

Placeholders for Dynamic Substitution
The \`value\` parameter in supported commands can include placeholders that are dynamically replaced with actual values based on the context. The placeholders differ slightly depending on whether the backing object is a **file** or a **folder**.

### Placeholders for Files
- \`$value\`: Existing value of the variable.
- \`$name\`: The file name with extension.
- \`$namewithoutextension\`: The file name without extension.
- \`$extension\`: The file extension.
- \`$id\`: The file ID.
- \`$revision\`: The current revision of the file (PDM revision, not the PDM variable).
- \`$version\`: The current version of the file.
- \`$fullyqualifiedname\`: The full local path of the file.
- \`$fullyqualifiedfoldername\`: The full local path of the folder containing the file.
- \`$foldername\`: The name of the folder containing the file.
- \`$configuration\`: configuration name. Only valid for BOM command.

### Placeholders for Folders
- \`$value\`: Existing value of the variable.
- \`$name\`: The folder name.
- \`$foldername\`: The name of the parent folder.
- \`$id\`: The folder ID.
- \`$fullyqualifiedname\`: The full local path of the folder.

### Common Placeholders (Applicable to Both Files and Folders)
- \`$username\`: The name of the logged-in user.
- \`$vaultname\`: The name of the vault.
- \`$yyyy\`: The current year.
- \`$mm\`: The current month (two digits).
- \`$hh\`: The current hour (two digits).
- \`$mi\`: The current minute (two digits).
- \`$ss\`: The current second (two digits).
- \`$date\`: The current date.
- \`$time\`: The current time in the current locale.
- \`$guid\`: Unique identifier.
---

Using Variables in Dynamic Placeholders
In addition to placeholders, you can include other variables by enclosing them in square brackets (e.g., \`[VariableName]\`). These variables are dynamically resolved based on the context of the file or folder.

---

Example Usage
Here’s an example of how to use dynamic placeholders in a command:

### Renaming a File

rename -filePath 1.sldprt -value "$nameWithoutExtension_$yyyy$mm$dd$extension"`,
    keywords: ['eval', 'dynamic', 'placeholders', 'pdmshell'],
    category: 'scripting'
  },
  {
    id: 'export',
    title: 'EXPORT Command',
    content: `DESCRIPTION:

The \`ExportCommand\` allows you to export SOLIDWORKS files from the PDM vault to various formats using SOLIDWORKS. This command supports exporting a single file or multiple files found via search, with options for specifying file extensions, export location, and more.

SYNTAX:

export [-search|-filePath] -name -directory -extensions -recursive 

PARAMETERS:

The export command requires several parameters:

- \`filePath\`: Path to the file to export (relative or absolute).
- \`name\`: The base name for the exported file(s). This supports evaluation. More [information here](/src/EVAL.html).
- \`directory\`: The target folder for exported files.
- \`extensions\`: Comma-separated list of file extensions to export to (e.g., \`pdf,dxf\`).
- \`search\`: Search query to find files for export.
- \`recursive\`: If set, search will include subfolders.
- \`timeout\`: timeout in seconds (for starting SOLIDWORKS only)

EXAMPLE:

Export a file to PDF and DXF in a specific directory:

export -filePath"Designs/part1.sldprt" -name "part1_export" -directory "Exports" -extensions "pdf,dxf"`,
    keywords: ['export', 'filepath', 'name', 'directory', 'extensions', 'search', 'recursive', 'timeout'],
    category: 'export'
  },
  {
    id: 'faq',
    title: 'Frequently Asked Questions (FAQ) for PDMShell',
    content: `---

1. What is PDMShell?
PDMShell is a command-line environment for **SOLIDWORKS PDM Professional** that allows users to automate, query, and batch process vault data using simple shell commands.  
It is designed for administrators, developers, and power users who want to extend PDM capabilities beyond the standard client.

---

2. What is the difference between the Free and Premium versions?

| Feature | **Free License** | **Premium License** |
|----------|------------------|---------------------|
| Max items processed per command | **5 items** | **Unlimited** |
| Access to all \`search\` commands | ✅ Included | ✅ Included |
| Workflow and transition integration | ❌ Not available | ✅ Available |
| Technical support & updates | ❌ Not available | Priority |
| Commercial use | ❌ Not available | ✅ Allowed |

The **Free License** is ideal for evaluation and lightweight tasks.  
The **Premium License** unlocks full automation, workflow integration, and unlimited command processing.

---

3. How do I install or update PDMShell?
You can install or update PDMShell from:
- The [official website](https://pdmshell.bluebyte.biz), or  
- The **Microsoft Store**

For detailed setup steps, see the [Installation Guide](howtoinstall.md).  
If you are updating from a previous version, uninstall the old one first to ensure all command definitions and descriptions are refreshed properly.

---

4. Why are some commands marked as “N/A” or missing descriptions after an update?
This usually happens when PDMShell is updated over an existing installation without removing old files.

### Solution:
1. Uninstall the current version of PDMShell.  
2. Download the latest version from the [official website](https://pdmshell.bluebyte.biz).  
3. Reinstall it cleanly to refresh command data and documentation.

---

5. Do I need administrative privileges to install PDMShell?
Yes. Administrative privileges are required when installing PDMShell from the website installer (MSI).  
If you install via the Microsoft Store, Windows handles elevation automatically.

---

6. What are the system requirements for PDMShell?
- **Operating System:** Windows 10 or 11  
- **SOLIDWORKS PDM Professional:** 2014 or newer  
- **SOLIDWORKS 3D:** 2017 or newer (for commands that interact with SOLIDWORKS)

---

7. How do I report a bug or request support?
You can reach us via:
- **Email:** [support@bluebyte.biz](mailto:support@bluebyte.biz)  
- **Web Form:** [bluebyte.biz/contact](https://bluebyte.biz/contact)

Please include your PDMShell version, command name, and error message when reporting issues.

---

8. Which commands are available in the Free version?
All **search-related commands** and basic file utilities are free to use (limited to processing **5 items per run**).  

These commands are ideal for quick lookups, validation, and testing automation workflows before upgrading to Premium.

---

For additional questions, contact us anytime at [support@bluebyte.biz](mailto:support@bluebyte.biz).`,
    keywords: ['faq', 'frequently', 'asked', 'questions', 'pdmshell'],
    category: 'general'
  },
  {
    id: 'freevspremium',
    title: 'PDMShell Free vs Premium',
    content: `PDMShell comes in two editions: **Free** for light use and **Premium** for full automation in SOLIDWORKS PDM.

---

OVERVIEW

| Edition | Description |
|----------|--------------|
| **Free** | Ideal for testing and small jobs. Processes up to **5 items per command**. |
| **Premium** | Full access with **unlimited processing**, workflow automation, and scripting. |

---

FEATURE COMPARISON

| Feature | Free | Premium |
|----------|------|----------|
| Max items per command | 5 | Unlimited |
| All \`search\` commands | ✅ | ✅ |
| \`printfromsource\`, \`getvar\` | ✅ (5-limit) | ✅ Unlimited |
| Workflow & transitions | ❌ | ✅ |
| Automation scripting | ❌ | ✅ |
| Alias & renaming | ✅ | ✅ |
| Priority support | ❌ | Full |
| Commercial use | ✅ (non-resellers) | ✅ |
| Reseller use | ❌ | ✅ |
| Cost | Free | Paid |

---

FREE EDITION

Perfect for evaluation, quick lookups, and validation tasks.  
**Limit:** 5 items per command.  
**Note:** Resellers and VARs may not use the Free version commercially.

**Example:**

printfromsource -filePath "source.csv" -csv "output.csv"

BUY PREMIUM

To buy a Premium PDMShell license, visit:
http://bluebyte.biz/product/pdmshell`,
    keywords: ['freevspremium', 'pdmshell', 'free', 'premium'],
    category: 'general'
  },
  {
    id: 'frogleap',
    title: 'FROGLEAP Command',
    content: `DESCRIPTION:
Frog leaps an old version as newest. 

SYNTAX:

frogleap -search -filePath -oldVersion

PARAMETERS:
- \`search\`: The search operation to use.
- \`filePath\`: The file(s) to be frog leaped. This is the default parameter.
- \`oldVersion:\` The old version to leap. This is an integer.

EXAMPLES:
\`\`\` bash
frogleap -filePath "file1.sldprt" -oldVersion 2

REMARKS:
- The \`search\` parameter searches the current directory and does not drill down. The search query is a PDM one, so you can use \`%\` for wildcard.

TUTORIAL:
 <video src="https://bluebyte.biz/wp-content/pdmshellvideos/frogleap.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>`,
    keywords: ['frogleap', 'search', 'filepath'],
    category: 'version-control'
  },
  {
    id: 'get',
    title: 'GET Command',
    content: `DESCRIPTION:
Retrieves a specified version of a file or files (via search).

SYNTAX:

get -search -filePath -version

PARAMETERS:
- \`search\`: The search operation to use.

- \`filePath\`: The file(s) to retrieve. This is the default parameter.

-\`version\`:  (Optional) The version of the file to retrieve

-\`directory\`: (Optional) Folder where to deposit the file. Can be outside vault. Do not end with \\\\. If not specified, file is cached in its folder. 

-\`getoptions\`: (Optional). Allows you to cache references as well:

| Option Name (CLI)        | Description |
|--------------------------|-------------|
| Simple                   | Retrieves the file with no additional options applied. |
| MakeReadOnly             | Marks the retrieved file as read-only in the local cache. |
| DisableRefresh           | Does not refresh File Explorer after the file is retrieved. |
| RefsOnlyMissing          | Retrieves only referenced files that are not already present on the local hard disk. |
| RefsVerLatest            | Retrieves the latest versions of referenced files that the user has permission to see, instead of the attached (as-built) versions used when the file was checked in. |
| RefsOverwriteLocked      | Retrieves referenced files even if they are checked out and overwrites local changes; **warning:** any previous modifications to checked-out files will be lost. |
| ForPreview               | Retrieves only referenced files required for SOLIDWORKS PDM preview when retrieving the referencing file. |

EXAMPLES:

get -filePath "file1.sldprt" -Version 2

REMARKS:
- The \`search\` parameter searches the current directory and does not drill down. The search query is a PDM one, so you can use \`%\` for wildcard.`,
    keywords: ['get', 'search', 'filepath', 'version', 'directory', 'getoptions'],
    category: 'version-control'
  },
  {
    id: 'getvar',
    title: 'GETVAR Command',
    content: `DESCRIPTION:
Gets the value of a variable for a specified file or folder.

SYNTAX:

getvar -filePath -variableName -configs -clear -version

PARAMETERS:
- \`filePath\` :  
  The file or folder to get the variable from.

- \`variableName\` :  
  The variable name to retrieve.

- \`configs\` :  
  The configuration names to retrieve the variable from, separated by commas.

- \`clear\` :  
  Clears the variable value.

- \`version\` :  
  The version of the file to retrieve the variable from.

EXAMPLES:

getvar -filePath "file1.sldprt" -variableName "CustomVar"

REMARKS:
- The configuration names should be separated by commas.
- The variable must be in the data card.
- **This comand will return what's in the locale cache which may not be necessarily the latest version. For that, please use \`getVarFromDB\`**.`,
    keywords: ['getvar', 'filepath', 'variablename', 'configs', 'clear', 'version'],
    category: 'variables'
  },
  {
    id: 'getvarfromdb',
    title: 'GETVARFROMDB Command',
    content: `DESCRIPTION:
Gets the value of a variable for a specified file or folder directly from the database.

SYNTAX:

getvarfromdb -filePath -variableName -configs

PARAMETERS:
- \`filePath\` :  
  The file or folder to get the variable from.

- \`variableName\` :  
  The variable name to retrieve from the database.

- \`configs\` :  
  The configuration names to retrieve the variable from, separated by commas.

EXAMPLES:
getvarfromdb -f "file1.sldprt" -variableName "CustomVar"

REMARKS:
- The configuration names should be separated by commas.
- This command will always return the latest value.`,
    keywords: ['getvarfromdb', 'filepath', 'variablename', 'configs'],
    category: 'variables'
  },
  {
    id: 'help',
    title: 'HELP Command',
    content: `DESCRIPTION:
Provides help about a command.

SYNTAX:

help [-command|-c]

PARAMETERS:
-\`command\`: The specific command you need help with.

EXAMPLES:

help -c cd #opens the help page about the change directory command`,
    keywords: ['help', 'command'],
    category: 'system'
  },
  {
    id: 'history',
    title: 'HISTORY Command',
    content: `DESCRIPTION:
Prints the history of a file.

SYNTAX:

history [-search|-filePath] 

PARAMETERS:
- \`search\`:  The search operation to use.

- \`filePath\`: The file to get the history for.

EXAMPLES:

history -f "file1.sldprt"
# lists the history of file1

REMARKS:
- The search parameter searches the current directory and does not drill down. The search query is a PDM one, so you can use \`%\` for wildcard.

PREVIEW:
![History Command](../images/history.png)`,
    keywords: ['history', 'search', 'filepath'],
    category: 'version-control'
  },
  {
    id: 'howtoinstall',
    title: 'How to Install/Update PDMShell',
    content: `PDMShell can be installed or updated from our official website or via the Microsoft Store. For the best experience, we **highly recommend downloading PDMShell from our official website** to ensure you always have the latest version.

The Microsoft Store does not automatically update PDMShell. If you installed PDMShell via the Microsoft Store, you may need to uninstall it and reinstall the latest version manually.

---

Installation Methods

### 1. From Our Website (Recommended)
- Visit our official website to download the latest version of PDMShell:  
<div align="center">
  <a href="https://bluebyte.biz/wp-json/slm_custom/downloadpdmshell" class="download-button">⬇️ DOWNLOAD PDMShell LATEST VERSION</a>
</div>

- If **Safe Browsing** is turned off in your browser (e.g., Chrome), the installer might be flagged as unverified. Simply click on **Download Anyway** or **Keep** to proceed with the download.

![Safe Browsing Warning](/images/image.png)

- After downloading, double-click the installer and follow the on-screen instructions to complete the installation.  
  > **Note**: You may need administrative privileges to install PDMShell.

---

### 2. From the Microsoft Store
1. Open the **Microsoft Store** on your Windows device.
2. Search for **PDMShell** in the search bar.
3. Select the PDMShell app from the search results.
4. Click **Get** or **Install** to begin the installation process.
5. Wait for the installation to complete, and then launch PDMShell from the Start menu.

---

Notes
- **Administrative Privileges**: Depending on your system settings, you may need admin privileges to install PDMShell, especially if installing from the official website.
- **Updates**: The website always contains the latest version of PDMShell. If you installed PDMShell via the Microsoft Store, you may need to manually uninstall and reinstall to get the latest updates.

Common Update Issues

Sometimes after updating, new commands might show up as \`N/A\` in the help command. In such case, please uninstall PDMShell and reinstall it to reload the latest resources.  

![updateissue](../images/updateissue.png)

---

System Requirements
To ensure PDMShell runs smoothly, your system must meet the following requirements:
- **Operating System**: Windows 10/11
- **SOLIDWORKS PDM Professional**: Version 2014 or newer
- **SOLIDWORKS 3D**: Version 2017 or newer (for commands that use SOLIDWORKS)

---

Support
For further assistance, visit our [Support Page](https://bluebyte.biz/contact) or contact us at \`amen@bluebyte.biz\`.`,
    keywords: ['howtoinstall', 'how', 'install', 'update', 'pdmshell'],
    category: 'general'
  },
  {
    id: 'inbox',
    title: 'INBOX Command',
    content: `DESCRIPTION:
Opens the PDM inbox or sends a message as the logged-in user.

SYNTAX:

inbox -filePath -name -value

PARAMETERS:
-\`name\`: Name of the user to send the message to. 
-\`value\`: Message: supports evaluation against the \`filePath\`.
-\`filePath\`: Associated file

EXAMPLES:

inbox -message 'File checked in successfully'
# sends the specified message to the logged-in user`,
    keywords: ['inbox', 'name', 'value', 'filepath'],
    category: 'system'
  },
  {
    id: 'index',
    title: 'PDMShell',
    content: `<style>
  body {
    background-color: #121212;
    color: #e0e0e0;
    font-family: Arial, sans-serif;
  }git 
  h2 {
    color: #bb86fc;
  }
  p {
    color: #e0e0e0;
  }
  a {
    color: #bb86fc;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 20px 0;
  }
    
  .card {
    background-color: #1f1f1f;
    border: 1px solid #333;
    border-radius: 8px;
    margin: 10px;
    padding: 20px;
    width: 300px;
    text-align: center;
  }
  .card img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }
  .video-container {
    background-color: black;
    width: 100%;
 padding: 10px;
      margin: auto;
    text-align: center;
  }
  .video-container video {
    width: 100%;
    max-width: 800px;
    height: auto;
    border-radius: 8px;
  }
  .download-button {
    display: inline-block;
    background-color: #bb86fc;
    color: #ffffff;
    font-weight: bold;
    text-transform: uppercase;
    padding: 10px 20px;
    border-radius: 8px;
    margin: 20px 0;
    text-align: center;
  }
  .download-button:hover {
    background-color: #9b6fcf;
  }

 body {
      background-color: #1a1a1a;
      margin: 0;
      font-family: 'Open Sans', sans-serif;
    }

    .header-container {
      display: flex;
      padding: 10px;
      margin: auto;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
    }

    .header-text {
      color: white;
      text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
      font-weight: 600;
      font-size: 32px;
      margin: auto;
      text-transform: uppercase;
      letter-spacing: 1px;
      line-height: 1.4;
      max-width: 600px;
    }

  

    @media (max-width: 768px) {
      .header-container {
        flex-direction: column;
        align-items: flex-start;
      }

    
    }

</style>

<div class="video-container">
<div class="header-container">
   
    <div class="header-text">
      Best Commandline for <br>
      SOLIDWORKS PDM Professional. 
    </div>
    </div>
 <iframe width="850" height="500" src="https://www.youtube.com/embed/UgNCkIuo-CM?si=h3U4PrZX-ES0bC8T" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    
  </video>
<p style="color: #bbbbbb; margin:auto; font-family:  'Open Sans', sans-serif;">
  A 29-min walkthrough of PDMShell covering the most commonly used commands
</p>
</div>

</div>
<br>

**PDMShell**, a command-line interpreter designed to streamline and automate tasks within **SOLIDWORKS PDM Professional**. We also provide helpful articles on PDM best practices and tooling. Before submitting a support ticket, we highly recommend reviewing the documentation and troubleshooting guides available on this site. Click on PDM Commands to get [started](../src/introduction.html).

<br>

<div align="center">
  <a href="https://bluebyte.biz/wp-json/slm_custom/downloadpdmshell" class="download-button">DOWNLOAD PDMSHELL DIRECTLY</a>
</div>

<br>
<!-- 
<div style="text-align: center;">
  <h2 style="color: #bb86fc; margin-bottom: 10px;">PDMShell is free to download and use*.</h2>
  <p style="color: #e0e0e0; font-family: Arial, sans-serif; margin: 0 auto; max-width: 800px;">
    PDMShell is free to use and allows you to test all commands with some limits without committing to a license. To buy a license, please visit the 
    <a href="https://bluebyte.biz/product/pdmshell" style="color: #bb86fc; text-decoration: none;">Blue Byte Systems online shop</a>. Read details below.
  </p>
</div>

<br>

 
<div class="container" style="flex-direction: column; align-items: center;">
  <div class="card" style="width: 100%; max-width: 800px; background-color: #000000; border-radius: 12px; padding: 20px; margin: 10px;">
    <h2 style="color: #ffffff;">Find Any File Archive Path</h2>
    <p style="color: #bbbbbb;">Learn how to manage archive paths effectively in PDMShell.</p>
    <video src="https://bluebyte.biz/wp-content/pdmshellvideos/archive path.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>
  </div>
 
  <div class="card" style="width: 100%; max-width: 800px; background-color: #000000; border-radius: 12px; padding: 20px; margin: 10px;">
    <h2 style="color: #ffffff;">Edit Datacards like a Boss</h2>
    <p style="color: #bbbbbb;">Change datacard values for one of many files using the SetVar command.</p>
    <video src="https://bluebyte.biz/wp-content/pdmshellvideos/setvar.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>
  </div>

  <div class="card" style="width: 100%; max-width: 800px; background-color: #000000; border-radius: 12px; padding: 20px; margin: 10px;">
    <h2 style="color: #ffffff;">Change Directory</h2>
    <p style="color: #bbbbbb;">Understand how to use the CD command to navigate directories in PDMShell.</p>
    <video src="https://bluebyte.biz/wp-content/pdmshellvideos/cd.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>
  </div>

  <div class="card" style="width: 100%; max-width: 800px; background-color: #000000; border-radius: 12px; padding: 20px; margin: 10px;">
    <h2 style="color: #ffffff;">Checkout, 1, 10 or 1000 Files In One Line</h2>
    <p style="color: #bbbbbb;">Discover how to use the CHECKOUT command to check out files from the vault.</p>
    <video src="https://bluebyte.biz/wp-content/pdmshellvideos/checkout.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>
  </div>

  <div class="card" style="width: 100%; max-width: 800px; background-color: #000000; border-radius: 12px; padding: 20px; margin: 10px;">
    <h2 style="color: #ffffff;">List Directory Content</h2>
    <p style="color: #bbbbbb;">Explore the DIR command to list files and folders in the current directory.</p>
    <video src="https://bluebyte.biz/wp-content/pdmshellvideos/dir.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>
  </div>

  
  <div class="card" style="width: 100%; max-width: 800px; background-color: #000000; border-radius: 12px; padding: 20px; margin: 10px;">
    <h2 style="color: #ffffff;">Concurrent PDM Sessions</h2>
    <p style="color: #bbbbbb;">Learn how to use the  LOGIN command to authenticate with the vault.</p>
    <video src="https://bluebyte.biz/wp-content/pdmshellvideos/login.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>
  </div>

  <div class="card" style="width: 100%; max-width: 800px; background-color: #000000; border-radius: 12px; padding: 20px; margin: 10px;">
    <h2 style="color: #ffffff;">Options</h2>
    <p style="color: #bbbbbb;">Understand the various options available in PDMShell to customize your experience.</p>
    <video src="https://bluebyte.biz/wp-content/pdmshellvideos/options.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>
  </div>

  <div class="card" style="width: 100%; max-width: 800px; background-color: #000000; border-radius: 12px; padding: 20px; margin: 10px;">
    <h2 style="color: #ffffff;">Power Search Capabilitiy</h2>
    <p style="color: #bbbbbb;">Learn how to use the Search command to find files and folders efficiently.</p>
    <video src="https://bluebyte.biz/wp-content/pdmshellvideos/search.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>
  </div>

<div align="center">
  <a href="https://apps.microsoft.com/detail/XPFFXTTJDCW85C?hl=en-US&gl=CA&ocid=pdpshare" target="_blank">
    <img src="../images/microsoftstore.png" alt="Microsoft Store" width="300" height="150">
  </a>
</div> -->

Need more power? Choose Premium.

Upgrade to the **Premium Version** of PDMShell to unlock advanced features that take your productivity to the next level. With the Premium Version, you can:

- Call PDMShell directly from other applications, enabling seamless integration into your workflows.
- Run PDMShell as a **workflow transition action**, automating complex tasks and saving time.
- Process **unlimited** number of files. Free version caps at items per search.

Take advantage of these powerful features to streamline your PDM operations and enhance your team's efficiency.

[Buy the Premium Version Now](https://bluebyte.biz/product/pdmshell)

Need more information or want to discuss how PDMShell can fit into your workflow? Schedule a call with us today:  
[Schedule a Call](https://calendly.com/bluebyte)

Contact Us

For more information or to get in touch with our support team, please refer to the [Contact Us](https://bluebyte.biz/contact) page.

*See EULA page for licensing requirements and restrictions for SOLIDWORKS partners and resellers.`,
    keywords: ['index', 'pdmshell'],
    category: 'general'
  },
  {
    id: 'infovar',
    title: 'INFOVAR Command',
    content: `DESCRIPTION:
Gets information about a variable.

SYNTAX:
infovar [-v variable_name]

PARAMETERS:
-v variable_name - The variable name to retrieve information for.

EXAMPLES:
infovar -v Description

Preview 

![InfoVar Command](../images/infovar.png)`,
    keywords: ['infovar'],
    category: 'variables'
  },
  {
    id: 'instances',
    title: 'Notes About Running PDMShell in Single Instance Mode',
    content: `PDMShell can run in two modes:

- **Multi Instance Mode** (default)
- **Single Instance Mode** (one controller instance, all commands routed to it)

Single instance mode is useful when you want:

- faster execution for multiple commands
- automation pipelines that require sequential execution

---

Single Instance Mode Overview

To enable **Single Instance Mode**, start PDMShell using:

pdmcli.exe /single

or 

pdmcli.exe -single

![singleinstance](../images/singleinstance.png)

When PDMShell is running in **Single Instance Mode**, you’ll see a **single-instance indicator** in the top-right corner of the window. It shows a **“1” icon**, confirming that all commands will be routed to this instance from other **single** instances.

If PDMShell is **not** running in single instance mode, the indicator will display an **infinity symbol (∞)**, meaning **multiple PDMShell instances are allowed** and each command launches independently in its own PDMShell process.

With single instance, you can:

✅ launch PDMShell as a single instance controller  
✅ allow subsequent commands to reuse the same PDMShell instance  
✅ improve performance if triggered from \`cmd.exe\` or \`Dispatch\`   
✅ prevent multiple conflicting PDMShell instances

### UAC, Permissions, and Single Instance Mode

![singlemodeuac](../images/singlemodeuac.png)

PDMShell’s **Single Instance Mode** relies on Windows’ global mutex system.  Because of this, **User Account Control (UAC)** and **process elevation** matter.

To attach to the single instance, you must ensure that:

- If the first instance is started as **Admin**, all following calls must also run **as Admin**
- If the first instance is started **without elevation**, all following calls must also run **without elevation**

Avoid running PDMShell as a Windows Administrator if you have custom add-ins installed.  Check-in and check-out commands can create instances of your add-in inside the host application's memory. If the add-in was registered under a different user or UAC level, PDM will throw a **“Class not registered”** error.

Executing Commands in Single Instance Mode

Once PDMShell is running with \`/single\`, **all subsequent calls to \`pdmcli.exe\` must also include \`/single\`**, or PDMShell will launch a new instance instead of attaching.

Example:

    pdmcli.exe /single "help command checkout"

This will:

- connect to the already running instance
- execute \`help command checkout\`
- return output immediately

When calling from \`cmd.exe\`, /single or -single cannot be contained in the double quote.

Tips for Single Instance Mode

- Always include \`/single\` in **every call**
- [Use proper quote escaping when calling from Dispatch](escapingquotes.md)
- Use Single Instance mode for sequences of operations
- Use Multi Instance mode for isolated one-shot commands`,
    keywords: ['instances', 'notes', 'about', 'running', 'pdmshell', 'single', 'instance', 'mode'],
    category: 'system'
  },
  {
    id: 'introduction',
    title: 'Introduction to PDMShell',
    content: `Welcome to **PDMShell**, the command-line interpreter designed specifically for **SOLIDWORKS PDM Professional**. PDMShell empowers engineers and IT professionals with a **powerful**, **flexible**, and **efficient** tool for automating and streamlining tasks within the SOLIDWORKS PDM environment.

### Using the Help System

PDMShell provides a comprehensive help system and detailed command documentation to guide you through its features. Here's how to get started:

- To view a list of all available commands, type:
  \`\`\`bash
  help
  \`\`\`
- To get detailed information about a specific command, type:
  \`\`\`bash
  help -command <command>
  \`\`\`
  For example:
  \`\`\`bash
  help -command cd
  \`\`\`

### Understanding the Command Documentation Structure
Each command page in PDMShell documentation is organized into the following sections:

1. **DESCRIPTION**: A brief explanation of what the command does.
2. **SYNTAX**: The syntax for using the command, including required and optional parameters.
3. **PARAMETERS**: A detailed explanation of each parameter, including whether it is required or optional.
4. **EXAMPLES**: Practical examples of how to use the command.
5. **REMARKS**: Additional notes, tips, or special considerations for using the command.
6. **TUTORIAL**: A short video tutorial demonstrating the command in action (if available).

### Example Command Documentation
Here’s an example of how a command is documented:

#### CD Command Documentation

**DESCRIPTION**:  
Changes the current PDM directory.

**SYNTAX**:  

cd [-directory|-id]

**PARAMETERS**:  
- \`directory\`: The directory to switch to. The directory parameter can be a relative or absolute path in PDM.  
- \`id\`: ID of the folder to navigate to.

**EXAMPLES**:  

cd -directory 'C:\\Vault\\NewFolder' # Navigates to NewFolder
cd -id 755 # Navigates to the folder with ID 755

**REMARKS**:  
- Use \`cd..\` to navigate to the parent folder or \`cd\\\` to navigate to the root of the vault.  
- If you just created a new folder and want to \`cd\` to it using autocomplete, use the \`dir\` command with the \`-refresh\` parameter to reload the session.  
- \`directory\` is the default parameter, so you don’t need to specify it if it’s the only parameter in your command.  

### Case Sensitivity

As of **PDMShell 3.0.1**, all **command names**, **parameter names**, and **values** are **case-sensitive**.

### Escaping Quotes

Escaping quotes when passing arguments to PDMShell depends on **where the command originates**. [Please read this dedicated article](escapingquotes.md).

**TUTORIAL**:  
<video src="https://bluebyte.biz/wp-content/pdmshellvideos/cd.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>

By following this structure, you can quickly learn how to use any command in PDMShell and integrate it into your workflows.

---

📞 Getting Support

If you need assistance or have any questions, we're here to help!   

- **Contact Us**:  
  Click the button below to reach out to our support team:  
  [Get Support](mailto:support@bluebytesystemsinc.zohodesk.com)

---

Thank you for choosing **PDMShell**! We’re excited to help you streamline your PDM workflows and unlock new levels of productivity.`,
    keywords: ['introduction', 'pdmshell'],
    category: 'general'
  },
  {
    id: 'kill',
    title: 'KILL Command',
    content: `DESCRIPTION:
Kills a process.

SYNTAX:

kill -process 

PARAMETERS:
- \`process\`: The process to terminate (with extension)

EXAMPLES:

kill sldworks.exe
# terminates all open SOLIDWORKS sessions.

REMARKS:
- This command uses \`taskkill\` from the command line.
- **This command requires PDM to be run as an administrator**. 
- PDMShell adds a note called \`ADMIN\` in the top-right area of its window when it is open as admin.`,
    keywords: ['kill', 'process'],
    category: 'system'
  },
  {
    id: 'login',
    title: 'LOGIN Command',
    content: `DESCRIPTION:
Authenticates a user to a specified vault.

SYNTAX:

login [-auto|-win -username -password|-external -username -password ] -vaultname 

PARAMETERS:
\`auto\`: Automatic authentication with current user. Displays login dialog box if not logged in.

\`win\`: Automatic Windows authentication with current user. Does not display login dialog box.

\`external\`: Toggle ensures that a license is consumed.

\`username\`:  Username.

\`password\`:  Password.

\`vaultName\`: Vault Name.

EXAMPLES:

login -username admin -password ******** -vaultName bluebyte #logs into the bluebyte vault with a username ans a password
login -auto -vaultName bluebyte #logs into the blue byte vault using the existing PDM session

# REMARKS: 

- You must have a local vault view before you can start using PDMShell.
- The \`external\` parameter allows an application that is not supplied and supported by SOLIDWORKS Corporation to:
  - Log into SOLIDWORKS PDM Professional
  - Log into a vault view

TUTORIAL:
 <video src="https://bluebyte.biz/wp-content/pdmshellvideos/login.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>`,
    keywords: ['login', 'auto', 'win', 'external', 'username', 'password', 'vaultname'],
    category: 'authentication'
  },
  {
    id: 'mkdir',
    title: 'MKDIR Command',
    content: `DESCRIPTION:
Creates a new folder.

SYNTAX:

mkdir -directory

PARAMETERS:
- \`directory\`: The folder to create. Supports placeholders.

For more information about placeholders, refer to the [placeholders documentation](src/EVAL.html).

EXAMPLES:

mkdir -directory "NewFolder"
# Creates a new folder called NewFolder

REMARKS:
- To get the new folder to show up in the auto-complete, please use the command \`cd -refresh\`.
- \`directory\` is the default parameter. You do not need to specify it.`,
    keywords: ['mkdir', 'directory'],
    category: 'navigation'
  },
  {
    id: 'mkvar',
    title: 'MKVAR Command',
    content: `DESCRIPTION:
Creates a new variable.

SYNTAX:

mkvar -name -varType -mkvarflags -mkvarattributes 

PARAMETERS:
- \`name\`: The name of the variable to create.

- \`varType\`: The type of the variable.

- \`mkvarflags\`: The flags for the variable.

- \`mkvarattributes\`: The attributes for the variable. Seperated by \`#\`

EXAMPLES:

mkvar -name "NewVariable" -varType "Text" -mkvarflags "ReadOnly" -mkvarattributes "Attribute1#Attribute2"

VAR TYPE VALUES:

| Description                  |
|------------------------------|
| None                         |
| Text                         |
| Int                          |
| Float                        |
| Bool                         |
| Date                         |

MKVAR FLAGS VALUES:

| Value | Description                                                         |
|-----------------------------------------------------------------------------|
| Unique | Values of the variable must be unique; only used for files, ignored for folders |
| Mandatory | Missing values are not permitted; only used for files, ignored for folders |
| VerFreeUpdateAll | Every version and every revision, regardless access, workflow states etc., are affected by the variable update |
| VerFreeLatest | Only the latest version is affected by the variable update  |`,
    keywords: ['mkvar', 'name', 'vartype', 'mkvarflags', 'mkvarattributes'],
    category: 'variables'
  },
  {
    id: 'move',
    title: 'MOVE Command',
    content: `DESCRIPTION:
The \`move\` command moves file(s) from one folder in the vault to another.

You can move:
- A single file
- All files inside a folder
- Files returned from a search query

When a file is moved:
- All references are automatically updated by SOLIDWORKS PDM.
- Any parent files referencing the moved file are updated.
- File history and versions are preserved.

---

SYNTAX:

move -source -directory -search -recursive

---

PARAMETERS:

- \`source\`  
  The complete file path of the file to move.  
  You can also specify a folder path. This will move the files in that folder.  
  Temporary files starting with \`~\` are ignored.

- \`directory\`  
  Target directory where to move the file(s) to. Must exist in the vault.

- \`search\`  
  Search query. Use this to move all search results from the source folder.

- \`recursive\`  
  Affects the search parameter. Specify \`-recursive\` to make the search recursive.  
  The start location is the current directory.

---

EXAMPLES:

### Example 1: Move a Single File

move -source "C:\\Vault\\Parts\\Bracket.SLDPRT" -directory "\\Released"
Moves a single file to the Released folder.

---

### Example 2: Move All Files in a Folder

move -source "\\Projects\\OldProject" -directory "\\Archive"
Moves all files inside the specified folder.

---

### Example 3: Move Search Results

move -source "\\Projects" -search "Name=%.sldprt%" -recursive -directory "\\Archive"
Moves all part files found in the Projects folder (including subfolders) to the Archive folder.

---

NOTES:

- You must have permission to move the file(s).
- If the file is referenced by other files, referencing paths are updated automatically.
- If the file has references, those reference paths are updated automatically.
- Target directory must already exist in the vault.
- Move operations preserve version history.`,
    keywords: ['move', 'source', 'directory', 'search', 'recursive'],
    category: 'file-management'
  },
  {
    id: 'movefromsource',
    title: 'MOVEFROMSOURCE Command',
    content: `DESCRIPTION:
The \`movefromsource\` command moves file(s) in the vault using a CSV file as input.

Each row in the CSV specifies:
- The File ID
- The Target Directory

This command is designed for bulk relocation of files.

When a file is moved:
- All references are automatically updated by SOLIDWORKS PDM.
- Parent references are updated automatically.
- File history and versions are preserved.

---

SYNTAX:

movefromsource -source

---

PARAMETERS:

- \`source\`  
  Path to a CSV file containing file IDs and target directories.  
  The CSV must contain at least two columns:
  
  - \`FileID\`
  - \`TargetDirectory\`

---

CSV FORMAT:

### With Header:

FileID,TargetDirectory  
1234,\\Released  
5678,\\Archive\\2026  

### Without Header:

1234,\\Released  
5678,\\Archive\\2026  

---

EXAMPLES:

### Example 1: Basic CSV Move

movefromsource -source "C:\\temp\\movefiles.csv"
Moves all files listed in the CSV to their respective target folders.

---

NOTES:

- Target directories must already exist in the vault.
- You must have permission to move the specified files.
- If a FileID does not exist, that row will be skipped and logged.
- If a move fails due to permission or state restrictions, it will be reported.
- Reference updates are handled automatically by SOLIDWORKS PDM.
- CSV rows with invalid format will be skipped and logged.`,
    keywords: ['movefromsource', 'source', 'fileid', 'targetdirectory'],
    category: 'file-management'
  },
  {
    id: 'packandgo',
    title: 'PACKG Command',
    content: `DESCRIPTION:
The \`packg\` command performs a SOLIDWORKS Pack and Go operation on:

- A single assembly file  
- Multiple assemblies discovered via directory search  
- A CSV file containing a list of assembly paths  

This command launches SOLIDWORKS, executes Pack and Go for each assembly, and saves the results into a specified output directory.

By default, only \`.sldasm\` files are processed.

SYNTAX:

packg -source -directory [-search] [-includedrawings] [-recursive] [-prefix] [-suffix] [-timeout]

PARAMETERS:

- \`source\`  
  Single assembly file, directory of assemblies, or CSV file containing assembly paths.

- \`directory\`  
  Destination folder where Pack and Go results will be saved.  
  Supports dynamic placeholders:
  - $filename
  - $nameWithoutExtension
  - $directory
  - $date
  - $year

- \`search\`  
  Search pattern applied when source is a directory.  
  Default value is \`\\.sldasm$\`. Supports [regular expressions](https://en.wikipedia.org/wiki/Regular_expression).

- \`includedrawings\`  
  Includes associated drawing files (.slddrw) in the Pack and Go operation.

- \`recursive\`  
  Searches subdirectories when source is a directory.

- \`prefix\`  
  Adds a prefix to all generated file names.

- \`suffix\`  
  Adds a suffix to all generated file names.

- \`timeout\` SOLIDWORKS startup and pack and go timeout in seconds. Default is 30.

---

EXAMPLES:

### Example 1: Pack a Single Assembly

Packs a single assembly and saves results to D:\\Packages
packg -source "C:\\Projects\\Top.sldasm" -directory "D:\\Packages"

### Example 2: Pack All Assemblies in a Directory

Packs all assemblies (*.sldasm) in the specified folder
packg -source "C:\\Projects" -directory "D:\\Packages"

### Example 3: Recursive Directory Search

Searches subfolders and packs all assemblies found
packg -source "C:\\Projects" -directory "D:\\Packages" -recursive

### Example 4: Use Regex Search

Packs only assemblies that start with TOP_
packg -source "C:\\Projects" -search "^TOP_.*\\.sldasm$" -directory "D:\\Packages"

### Example 5: Pack Assemblies from CSV

Reads assembly paths from a CSV file and packs each one 
packg -source "C:\\Batch\\assemblies.csv" -directory "D:\\Packages"

### Example 6: Include Drawings

Includes associated drawing files in Pack and Go
packg -source "C:\\Projects\\Top.sldasm" -directory "D:\\Packages" -includedrawings

### Example 7: Prefix and Suffix

Adds prefix and suffix to all packed files
packg -source "C:\\Projects\\Top.sldasm" -directory "D:\\Packages" -prefix "SW_" -suffix "_Release"

### Example 8: Increase SOLIDWORKS Timeout

Allows more time for SOLIDWORKS to launch
packg -source "C:\\Projects" -directory "D:\\Packages" -timeout 300`,
    keywords: ['packandgo', 'packg', 'source', 'directory', 'search', 'includedrawings', 'recursive', 'prefix', 'suffix', 'timeout'],
    category: 'file-management'
  },
  {
    id: 'parameter_short_format',
    title: 'Short Format for Parameters in PDMShell',
    content: `Overview

PDMShell supports short formats for many of its parameters to make commands more concise and easier to use. These short formats are defined for specific parameters and can be used as an alternative to their full names. Below is a comprehensive list of parameters and their corresponding short formats.

---

List of Parameters and Their Short Formats

| **Parameter**            | **Short Format** | **Description**                                                                 |
|---------------------------|------------------|---------------------------------------------------------------------------------|
| \`username\`               | \`u\`              | Specifies the username for authentication.                                      |
| \`password\`               | \`p\`              | Specifies the password for authentication.                                      |
| \`vaultName\`              | \`v\`              | Specifies the name of the PDM vault.                                            |
| \`filePath\`               | \`f\`              | Specifies the file path to operate on.                                          |
| \`command\`                | \`c\`              | Specifies the command name.                                               |
| \`search\`                 | \`s\`              | Specifies the search query. Can use % for wildcard.                                                    |
| \`directory\`              | \`d\`              | Specifies the directory to operate on.  Wrap in "" if there are spaces.                                         |
| \`columns\`                | \`cols\`           | Specifies the columns to include in the output. Wrap in "" if there are spaces. Seperate multiple by comma.                                 |
| \`csv\`                    | \`csv\`            | Specifies the CSV file to use. You need to include extension.                                                 |
| \`sort\`                   | \`sort\`           | Specifies the sorting order by column name. Used only in \`dir\` command.                                                    |
| \`programName\`            | \`prog\`           | Specifies the program name.                                                     |
| \`configNames\`            | \`configs\`        | Specifies the configuration names. Wrap in "" if there are spaces. Seperate multiple by comma.                                               |
| \`value\`                  | \`val\`            | Specifies the value to set. Wrap in "" if there are spaces.                                                    |
| \`version\`                | \`ver\`            | Specifies the version of the file or software.                                  |
| \`variableName\`           | \`var\`            | Specifies the name of the variable.                                             |
| \`clearToggle\`            | \`cls\`            | Toggles clearing the variable. Used only \`setvar\` command.                                           |
| \`comment\`                | \`cmt\`            | Specifies a comment during check-in. Wrap in "" if there are spaces.                                                           |
| \`checkinoptions\`         | \`ciopt\`          | Specifies options for check-in operations.                                      |
| \`oldVersion\`             | \`oversion\`       | Specifies the old version of the file.                                          |
| \`refresh\`                | \`refresh\`        | Refreshes the current session autocomplete list. Use with \`dir\`.                                                  |
| \`checkinouttoggle\`       | \`checkinouttoggle\` | Toggles check-in or check-out operations.                                       |
| \`process\`                | \`process\`        | Specifies the process to execute.                                               |
| \`list\`                   | \`list\`           | Lists items based on the specified criteria.                                     |
| \`batch\`                  | \`batch\`          | Specifies batch operations.                                                     |
| \`id\`                     | \`id\`             | Specifies the ID of the file or folder.                                         |
| \`mkvarattributes\`        | \`mkvarattributes\`| Specifies attributes for variable creation.                                     |
| \`TransitionID\`           | \`trid\`           | Specifies the transition ID.                                                    |
| \`source\`                 | \`source\`         | Specifies the source file or folder.                                            |
| \`destory\`                | \`dest\`           | Specifies the destination file or folder.                                       |
| \`recursive\`              | \`recursie\`       | Toggles recursive operations.                                                   |
| \`extensions\`             | \`ext\`            | Specifies file extensions to include.                                           |
| \`ignoreexisting\`         | \`ignoreex\`       | Ignores existing files or folders.                                              |
| \`date\`                   | \`date\`           | Specifies the date.                                                             |
| \`updaterefs\`             | \`updaterefs\`     | Updates references for files or folders.                                        |
| \`includesubfolders\`      | \`includesubfolders\` | Includes subfolders in the operation.                                          |
| \`includeproperties\`      | \`includeproperties\` | Includes properties in the operation.                                          |
| \`toolboxflag\`            | \`toolboxflag\`    | Toggles the toolbox flag.                                                       |
| \`evaluatealias\`          | \`evaluatealias\`  | Evaluates aliases for dynamic placeholders.                                     |
| \`stringformat\`           | \`stringformat\`   | Specifies the string format.                                                    |
| \`taskName\`               | \`taskName\`       | Specifies the name of the task.                                                 |
| \`suffix\`                 | \`suffix\`         | Specifies a suffix to append.                                                   |
| \`prefix\`                 | \`prefix\`         | Specifies a prefix to prepend.                                                  |
| \`includedrawings\`        | \`includedrawings\` | Includes drawings in the operation.                                            |
| \`latest\`                 | \`latest\`         | Toggles the use of the latest version.                                          |

---

Usage Example

Here’s an example of using short formats in a command:

### Full Format

setvar -filePath "C:\\Vault\\File.sldprt" -variableName "VariableName" -value "NewValue"`,
    keywords: ['parameter_short_format', 'short', 'format', 'parameters', 'pdmshell'],
    category: 'general'
  },
  {
    id: 'print',
    title: 'PRINT Command',
    content: `DESCRIPTION:
Displays the biographical information about the specified file.

SYNTAX:

print [-filePath|-id]

PARAMETERS:
-filePath: The file to print biographical information for.

EXAMPLES:

print -filePath "C:\\SOLIDWORKSPDM\\Bluebyte\\API\\Sandbox\\fidget spinner\\___108545.SLDPRT"

The print command will print an output like the following: 

File Name     : ___108545.SLDPRT
Local Path    : C:\\SOLIDWORKSPDM\\Bluebyte\\API\\Sandbox\\fidget spinner\\___108545.SLDPRT
Folder Path   : \\API\\Sandbox\\fidget spinner

File ID       : 115310
Folder ID     : 457

HEXID         : 1C26E
Archive Path  : E\\0001C26E

Checked out?  : False

State ID      : 158
State Name    : New State
Current state : New State [Workflow: Vaulted]
Current Ver   : 7
Current Rev   : 

Transitions   :
Return Engineering [193] From New State [158] To In Design [9]`,
    keywords: ['print'],
    category: 'file-management'
  },
  {
    id: 'printfromsource',
    title: 'PRINTFROMSOURCE Command',
    content: `DESCRIPTION:
The \`printfromsource\` command is used to validate a list of filepaths in the PDM system based on a source CSV file. The CSV file must contain a header and a list of complete file paths in the first column.

---

SYNTAX:

printfromsource -filePath -csv 

PARAMETERS:
- \`filePath\`: (Required) The source file path. This must be a CSV file with one column:
 - file Path: Complete file path.
- \`csv\`: Specifies the output csv. This will contains information about files from the source parameter.

EXAMPLES:
Rename files using a source CSV file:

printfromsource -filePath "source.csv" -csv "output.csv" 

REMARKS:
- The \`filePath\` parameter is mandatory and must point to a valid CSV file.
- The \`csv\` is the output from the verification process \`printfromsource\` performs:

| ID | Complete File Path | Folder ID | Checked Out | Where Used ID |
|----|---------------------|------------|--------------|----------------|
| 1  | C:\\Vault\\ProjectA\\Part1.SLDPRT | 105 | FALSE | 5021 |
| 2  | C:\\Vault\\ProjectB\\Drawing1.SLDDRW | 106 | TRUE | 5022 |
| 3  | C:\\Vault\\ProjectC\\Assembly1.SLDASM | 107 | FALSE | 5023 |`,
    keywords: ['printfromsource', 'filepath', 'csv'],
    category: 'file-management'
  },
  {
    id: 'quit',
    title: 'QUIT Command',
    content: `DESCRIPTION:
Quits the application.

SYNTAX:

quit -silent

PARAMETERS:
- \`-silent\`:
(Optional) suppresses the close dialog box.

REMARKS:
- This command runs silently in scripts. Read more about [scripting](/src/scripting.html).`,
    keywords: ['quit'],
    category: 'system'
  },
  {
    id: 'reboot',
    title: 'REBOOT Command',
    content: `DESCRIPTION:
Hard PDM reboot.

SYNTAX:

reboot

PARAMETERS:
This command has no parameters.

EXAMPLES:

reboot

REMARKS:
- This command uses \`taskkill\` from the command prompt to kill \`explorer.exe\` and \`edmserver.exe\` then restart \`explorer.exe\`.
- It requires PDM to be run as an administrator.`,
    keywords: ['reboot'],
    category: 'system'
  },
  {
    id: 'recover',
    title: 'RECOVER Command',
    content: `DESCRIPTION:
The \`recover\` command is used to recover files from a specified directory or source. It supports optional parameters for search queries and recursive operations.

SYNTAX:

recover -directory -search -recursive -source 

PARAMETERS:

- \`directory\`: Specifies the directory to recover files from. This parameter is optional.
- \`search\`: A search query to filter the files to recover. This parameter is optional. Supports % and * as wildcards.
- \`recursive\`: Enables recursive recovery of files within subdirectories. This parameter is optional.
- \`source\`: Specifies the source to recover files from. This parameter is optional.

- To generate a source csv file, use the command \`delete -list -csv deletedfiles.csv\` to generate a list of all deleted files in the current directory.
- You can include \`recursive\` to get all files from the subdirectories.
- To generate a source csv file for a particular directory, use \`directory\` in combination with \`list\` and \`csv\`. 

EXAMPLES:

recover -source "source.csv"
# Recovers files from the specified source.
recover -directory ""
# Recovers files from the current directory.

REMARKS:
- Ensure that the specified directory or source exists and is accessible.

TUTORIAL:
 <video src="https://bluebyte.biz/wp-content/pdmshellvideos/recover.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>`,
    keywords: ['recover', 'directory', 'search', 'recursive', 'source', 'list', 'csv'],
    category: 'file-management'
  },
  {
    id: 'releasenotes',
    title: '3.0.31 (2026-02-20)',
    content: `To update PDMShell properly, **download** the latest version, **uninstall** PDMShell and then **install** the latest version. **Do not update installed version.**

- Added \`docmanprops\` to edit properties using the document manager [DocManProps](DOCMANPROPS.md) command.

# 3.0.30 (2026-02-17)
- Added \`batch\` parameter for destroying files in the [DeleteFromSource](DELETEFROMSOURCE.md) command.

# 3.0.29 (2026-02-16)
- Minor changes and updates to the docs.

# 3.0.28 (2026-02-11)
- Added \`DuplicatedBy\` token to advanced search and \`DuplicateStrategy\` parameter to the search command.
- Added [Move](MOVE.md) and [MoveFromSource](MOVEFROMSOURCE.md) commands.
# 3.0.27 (2026-02-09)
- Added [Pack And Go](PACKANDGO.md)
- Updated [Where Used](WHEREUSED.md)  

# 3.0.26 (2026-01-05)
- Happy New Year 2026 🎊!
- [get command](GET.md): \`Directory\` parameter is now **optional**. If not specified, the file is cached in its folder. If specified with an empty value, the file is cached at the root of the vault.
- Update tooltip for the \`source\` parameter in the [clear cache command](CLEARACACHE.md)

# 3.0.25 (2025-12-23)
- No added commands or bug fixes.  
- Updated parameters tooltip in \`addtovault\`, \`rename\`, \`cd\` and others.

# 3.0.24 (2025-12-22)
- parameter tooltips (little box that shows up next to the parameter when you type in the command box) are now uniaue for each command. Over the next releases, we will update all tooltips for all parameters to make them more clear. The same parameter can be used in multiple commands having different function in each.

# 3.0.23 (2025-12-20)
- Added [update references command](UPDATEREFERENCES.md)

# 3.0.22 (2025-12-19)
- Added [copy command](COPY.md)

# 3.0.21 (2025-12-18)
- Fixed single instance bug. All commands are now executed sequentially. Output is not during commands execution anymore. This was in 3.0.19 and 20
- Added \`getoptions\` in [Get](GET.md)
- Added \`checkoutoptions\` in [Checkout](CHECKOUT.md)

# 3.0.20 (2025-12-12)
- Fixed timeout issue with [Export](EXPORT.md) and [RunSwMacro](RUNSWMACRO.md).
- Added \`name\`, \`filePath\` and \`value\` parameters to [INBOX](INBOX.md). 
- \`source\` parameter default to current directory in [addtovaultcommmand](ADDTOVAULT.md). 

# 3.0.19 (2025-12-11)
- Added \`winlog\` parameter for pdmcli.exe. See remarks section of [dump command](DUMP.md).
- Fixed single instance bug. All commands are now executed sequentially. Output is blocked during commands execution.

# 3.0.18 (2025-12-08)
- Rebuild. Previous faulty build.

# 3.0.17 (2025-12-08)
- Fixed single instance issue related to Windows enviornment variables
- Added note for \`solidworks\` and \`pdm\`parameters in the [Version](VERSION.md) command: **RESERVED FOR FUTURE. NOT IMPLEMENTED**   

# 3.0.16 (2025-12-07)
- [Export: Added timeout parameter launching SOLIDWORKS](EXPORT.md).
- [RunSwMacro: timeout parameter is also enabled for launching SOLIDWORKS](RUNSWMACRO.md).
- Enforced \`.pdmshell\` extension across all commands as the scripting file extension.
# 3.0.15
- skipped

# 3.0.14 (2025-12-05)
- [Login: Fix bug with parameter casing](LOGIN.md).
- [Login: Added implementation with the transition command](TRANSITION.md).
- Updated documentation

# 3.0.13 (2025-12-04)
- [VERSIONUPGRADE: Added a new command](VERSIONUPGRADE.md).
- [VERSIONUPGRADEFROMSOURCE: Added a new command (Reserved but not implemented)](VERSIONUPGRADEFROMSOURCE.md).

# 3.0.12 (2025-12-03)
- [SetRevisionFromSource: Added a new command](SETREVISIONFROMSOURCE.md).

# 3.0.11 (2025-12-02)
- [SetRevision: Added a new command](SETREVISION.md).
 - Fixed evaluation bug: Bracketed variable \`[Variable]\` fail to evaluate in \`name\` and \`value\` parameters

# 3.0.10 (2025-12-01)
- Rebuild

# 3.0.9 (2025-12-01)
 - [INFOVAR: Fixed bug with related to single flag variables](INFOVAR.md) 
 - [SETVAR: Added support for handling folder cards](SETVAR.md) 

# 3.0.8 (2025-11-30)
 - Fixed unhandled exception when license is limited that causes a crash in all commands
 - Fixed evaluation bug (order)
 - Fixed some minor bugs in BOM command

# 3.0.7 (2025-11-29)
 - [BOM: Added a new command](BOM.md). Please see notes [here](howtoinstall.md#common-update-issues) about new commands in the **Common Update Issues** section.
 - [Added \`$configuration\` placeholder](EVAL.md)
 - Added release notes page
 - Fixed some minor typos for the delete and destroy commands
 - Change toolbar icons and tooltips for better UX`,
    keywords: ['releasenotes'],
    category: 'general'
  },
  {
    id: 'rename',
    title: 'RENAME Command',
    content: `DESCRIPTION:
Renames a specified file.

SYNTAX:

rename -filePath -value -search

PARAMETERS:
- \`filePath\`: The filerename.
- \`value\`: The new name for the file. **YOU MUST INCLUDE THE EXTENSION**
- \`search\`: The search operation to use.

EXAMPLES:

rename -filePath "oldname.sldprt" -val "newname.sldprt"

REMARKS:
- The search parameter searches the current directory and does not drill down. The search query is a PDM one, so you can use \`%\` for wildcard.

VALUE EVALUATION:
The \`value\` parameter gets evaluated by PDMShell. PDMShell allows you to use placeholders in the new name, which will be replaced with actual values from the file. This can be useful to dynamically generate new names based on file properties or other variables. The following placeholders are supported:

- \`$filename\` - The file name without extension.
- \`$id\` - The file ID.
- \`$revision\` - The current revision of the file.
- \`$date\` - The current date.
- \`$time\` - The current time.
- \`$version\` - The current version of the file.
- \`$extension\` - The file extension.

Additionally, you can use variables enclosed in square brackets (e.g., \`[VariableName]\`) to include values from other variables.

Please read more information about placeholder evaluation [here](EVAL.md).

EXAMPLES:
If you use the value \`"$filename_$date_$version$extension"\`, it will be replaced with the file name, current date, and version, resulting in something like \`"oldname_10-12-2023_3"\`.`,
    keywords: ['rename', 'filepath', 'value', 'search'],
    category: 'file-management'
  },
  {
    id: 'renamefromsource',
    title: 'RENAMEFROMSOURCE Command',
    content: `DESCRIPTION:
The \`renamefromsource\` command is used to rename files in the PDM system based on a source CSV file. The CSV file provides the necessary information to map file IDs to their new names and folder IDs. This command supports alias evaluation for dynamic renaming.

---

SYNTAX:

renamefromsource -filePath -evaluatealias -csv 

PARAMETERS:
- \`filePath\`: (Required) The source file path. This must be a CSV file with three columns:

1. File ID: The ID of the file to be renamed.
2. New File Name: The new file name, including the extension.
3. Folder ID: The ID of the folder containing the file.

- \`evaluatealias\`: Toggle. This allows placeholders to be used in the new file name.
- \`csv\`: Specifies the path to an additional CSV file for batch renaming.

EXAMPLES:
Rename files using a source CSV file:

renamefromsource -filePath "C:\\data\\rename.csv" -evaluatealias  
# renames all the files in rename.csv while evaluating aliases

CSV FORMAT:
The source CSV file must have the following structure:

| File ID | New File Name           | Folder ID |
|---------|--------------------------|-----------|
| 123     | newfile1.txt             | 456       |
| 124     | anotherfile.docx         | 457       |
| 125     | examplefile_backup.pdf   | 458       |

- **File ID**: The ID of the file to be renamed.  
- **New File Name**: The desired new name for the file, including the extension.  
- **Folder ID**: The ID of the folder containing the file.

REMARKS:
- The \`filePath\` parameter is mandatory and must point to a valid CSV file.
- The \`evaluatealias\` parameter supports dynamic placeholders for renaming, such as $name, $revision, $yyyy, etc. Ensure the CSV file is properly formatted with three columns: File -ID, New File Name, and Folder ID.
- The \`csv\` parameter is optional and can be used to provide additional renaming data.

For more information about alias evaluation, refer to the [Dynamic Placeholders in PDMShell](EVAL.html).

TUTORIAL:
 <video src="https://bluebyte.biz/wp-content/pdmshellvideos/renamefromsource.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>`,
    keywords: ['renamefromsource', 'filepath', 'evaluatealias', 'csv'],
    category: 'file-management'
  },
  {
    id: 'runscript',
    title: 'RUNSCRIPT Command',
    content: `DESCRIPTION:
Runs a PDMShell script.

SYNTAX:

runscript -source -filePath -search -recursive

PARAMETERS:
- \`source\`:  Script file.  **Must end in \`.pdmshell\`** 

Script extension is \`.pdmshell\`

- \`filePath\`:  File path to run the script on. 
- \`search\`:  Search query to filter files.
- \`recursive\`: If specified, the command will run script on all files recursively in subdirectories.  
EXAMPLES:
 \`\`\`bash
runscript -filePath pdmscript.pdmshell -search "%.sldprt" -recursive 
# this will run pdm.script on all part files in the active directory and its subdirectories
 \`\`\`

REMARKS:
- A good way to start a script is using the \`start notepad.exe\` command to open up notepad.exe.
- In your script, you must use the alias \`$completefilename\` and \`$completefoldername\` to reference the file your script is targeting. This is required with the \`search\` or \`filePath\` parameters. 

FREE VERSION LIMIT:
- The free version is limited to 10 lines per script.`,
    keywords: ['runscript', 'source', 'filepath', 'search', 'recursive'],
    category: 'scripting'
  },
  {
    id: 'runswmacro',
    title: 'RUNSWMACRO Command',
    content: `DESCRIPTION:

The \`RunSWMacro\` command allows you to execute a SOLIDWORKS macro on a specific file or on multiple files found via search in the PDM vault. This is useful for automating repetitive tasks or applying custom logic to many files.

SYNTAX:

runswmacro -filePath -search -recursive -list -skip -count -timeout

PARAMETERS:

The command requires the following parameters:

- \`filePath\`: Path to the SOLIDWORKS macro file (\`.swp\` or \`.dll\`). This is required and the file needs to cached in PDM.
- \`search\`: Search query to find files to run the macro on.
- \`recursive\`: If set, search will include subfolders.
- \`list\`: csv file path of filepaths without a column header.
- \`skip\`: Skips the specified number of items. Only valid with \`list\`.
- \`count\`: Only processes the specified number of items. Only valid with \`list\`.
- \`timeout\`: Macro timeout in seconds (for both the macro to execute and for SOLIDWORKS to start too)

What version of SOLIDWORKS will PDMShell use?
PDMShell will use the latest SOLIDWORKS version installed on your system by checking the Windows Registry at:

HKEY_LOCAL_MACHINE\\SOFTWARE\\SolidWorks

If you have multiple SOLIDWORKS versions installed, PDMShell will automatically select the most recent version found in the registry.

List Example

C:\\TestVault\\part1.sldprt
C:\\TestVault\\assembly2.sldasm
C:\\TestVault\\drawing3.slddrw
C:\\TestVault\\bracket4.sldprt

SWP Macro

Please read the remarks below to properly call your macro.

- The macro procedure name must be called \`main\`.
- The macro module name must be called the file name of the macro appended by \`1\`. Example: If the macro called \`print.swp\` the module name must be called \`print1\`.

DLL Macro
Please read the requirements below to properly create your DLL macro.

### Requirements
- The macro class must implement the \`IPDMShellSOLIDWORKSMacro\` interface
- The class must be decorated with the \`PDMShellMacro\` attribute
- The interface can be found in the NuGet package \`BlueByte.PDMShell.SOLIDWORKSMacro\` on nuget.org

### Required NuGet Package Versions

Your project must use these specific versions of the NuGet packages:

<PackageReference Include="BlueByte.PDMShell.SOLIDWORKSMacro" Version="1.0.0" />
<PackageReference Include="BlueByte.SOLIDWORKS.Interops" Version="2019.0.0" />
<PackageReference Include="BlueByte.SOLIDWORKS.PDMProfessional.Interops" Version="2024.5.50" />

Install using Package Manager Console:

Install-Package BlueByte.PDMShell.SOLIDWORKSMacro -Version 1.0.0
Install-Package BlueByte.SOLIDWORKS.Interops -Version 2019.0.0
Install-Package BlueByte.SOLIDWORKS.PDMProfessional.Interops -Version 2024.5.50

Using different versions may result in compatibility issues or runtime errors.
These specific versions are tested and guaranteed to work with PDMShell.

### Example Implementation

using PDMShellSOLIDWORKSMacro;
using SolidWorks.Interop.sldworks;
using EPDM.Interop.epdm;

[PDMShellMacro]
public class MyMacro : IPDMShellSOLIDWORKSMacro
{
    public bool Execute(
        SldWorks swApp, 
        IEdmFile5 pdmFileObject, 
        IEdmFolder5 pdmFolderObject, 
        int handle, 
        string progress, 
        IPDMCmdLineCallback callback, 
        out string error)
    {
        error = string.Empty;
        // Update progress using the callback
        callback.AppendMessage("Starting macro execution...");
        
        // Your macro implementation here
        callback.AppendMessage($"Processing file: {pdmFileObject.Name}");
        
        // Report completion
        callback.AppendMessage("Macro execution completed successfully");

        return true;
    }
}

Use the \`callback.AppendMessage()\` method to provide progress updates and status messages during macro execution. These messages will be displayed in the PDMShell output.

### Running the Macro

# Run the DLL macro on all parts in the current directory
runswmacro -filePath "Macros/MyMacro.dll" -search "%.sldprt" -timeout 12000

The DLL must be built against .NET Framework 4.7.2 or higher

EXAMPLE:

# run batch export macro on all part in the current directory
 runswmacro -filePath "Macros/BatchExport.swp" -search "%.sldprt" 
 \`\`\``,
    keywords: ['runswmacro', 'filepath', 'search', 'recursive', 'list', 'skip', 'count', 'timeout'],
    category: 'scripting'
  },
  {
    id: 'runtask',
    title: 'RUNTASK Command',
    content: `DESCRIPTION:

The \`RUNTASK\` command allows you to execute a PDM task on a specific file or via search in the PDM vault. 

SYNTAX:

runtask -taskName -filePath -search -recursive

PARAMETERS:

The command requires the following parameters:

- \`taskName\`: Task name. This can be found in under Tasks in the Administration tool.
- \`filePath\`: Path to the affected file.
- \`search\`: (Optional) Search query to find files to run the macro on.
- \`recursive\`: (Optional) If set, search will include subfolders.

EXAMPLE:

# run PrintPDF task on an assembly
 taskrun -TaskName "PrintPDF" -filePath "Assembly.sldasm"  
 \`\`\``,
    keywords: ['runtask', 'taskname', 'filepath', 'search', 'recursive'],
    category: 'scripting'
  },
  {
    id: 'scripting',
    title: 'Scripting in PDMShell',
    content: `Overview
PDMShell supports scripting to automate tasks and streamline workflows. Scripts use the \`.pdmshell\` file extension and are plain text files, making them easy to create and edit using any text editor, such as Notepad.

---

Creating a Script
A PDMShell script is a sequence of PDMShell commands written in a plain text file. Each command is executed in the order it appears in the script.

### Script File Extension
Script file extension is \`.pdmshell\`.

### Example Script
Below is an example of a \`.pdmshell\` script:

# filepath: example.pdmshell
# This script automates exporting and adding files to the vault.

# Navigate to the working directory
cd "\\api\\sandbox\\fidget spinner"

# Create a new export folder with a dynamic name using the current folder
mkdir "$name-export-$date"

# Export all SolidWorks part files to the new folder as STEP files
export -search %.sldprt -directory "$name-export-$date" -extensions stp -name $namewithoutextension-$yyyy-$mm-$dd

# Change to the newly created export folder
cd "$name-export-$date"

# Add the exported files to the vault as stp files are NOT automatically added
addtovault -source " "

# Check in all files in the current folder
checkin -search %

# Open the folder in File Explorer
start .

### Script Annotations
1. **\`cd "\\api\\sandbox\\fidget spinner"\`**: Changes the current working directory to the specified path.
2. **\`mkdir "$name-export-$date"\`**: Creates a new folder with a dynamic name based on the current date and the folder name.
3. **\`export\`**: Exports all \`.sldprt\` files in the current directory to the newly created folder as \`.stp\` files, appending the current date to the file names.
4. **\`cd "$name-export-$date"\`**: Changes the working directory to the newly created export folder.
5. **\`addtovault\`**: Adds the exported files to the vault.
6. **\`checkin\`**: Checks in all files in the current folder to the vault.
7. **\`start .\`**: Opens the current folder in File Explorer.

---

### Comments

Lines that start with \`#\` are ignored.

Executing a Script
There are two ways to execute a \`.pdmshell\` script:

### 1. Using \`pdmcli.exe\`
You can execute a script using the \`pdmcli.exe\` command-line tool. Provide the script file as the first argument, wrapped in quotes if the file path contains spaces.

#### Example Command

pdmcli.exe "C:\\Scripts\\example.pdmshell"

The \`pdmcli.exe\` tool can be found in the installation folder under \`Program Files (x86)\\BLUE BYTE SYSTEMS INC\`.

### 2. Using the \`runscript\` Command
You can also execute scripts directly from the PDMShell console using the \`runscript\` command.

[Note]

#### Example Command

runscript -source "C:\\Scripts\\example.pdmshell"

For more information about the \`runscript\` command, refer to the [runscript documentation](RUNSCRIPT.html).

---

Workflow Integration
For users with the **Premium Version** of PDMShell, \`pdmcli.exe\` can be hooked into workflow transitions. This allows scripts to be executed automatically as part of a workflow, enabling seamless automation of complex processes.

---

Remarks
- Scripts are a powerful way to automate repetitive tasks and enforce consistency in workflows.
- Since \`.pdmshell\` files are plain text, they can be created and edited using any text editor.
- Ensure the script file is saved with the \`.pdmshell\` extension for proper execution.
- Use comments (\`#\`) in scripts to document the purpose of each command for better readability.

TUTORIAL:
 <video src="https://bluebyte.biz/wp-content/pdmshellvideos/scripting.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>

Let Blue Byte Systems Write Your Scripts
If you need assistance creating scripts for your specific workflows, Blue Byte Systems offers professional scripting services. Their team of experts can design and implement custom .pdmshell scripts tailored to your requirements, ensuring optimal efficiency and accuracy.

To learn more about this service, contact Blue Byte Systems directly through their support page.`,
    keywords: ['scripting', 'pdmshell'],
    category: 'scripting'
  },
  {
    id: 'scriptsfromtransition',
    title: 'Notes About Running PDMShell Scripts from Workflow Transitions',
    content: `When you want to run PDMShell scripts as part of a workflow transition in SOLIDWORKS PDM, you can configure the transition to execute scripts seamlessly. This allows you to automate complex tasks during transitions, such as updating variables, exporting files, or triggering external processes.

Workflow Transition Configuration

![workflowtransition](../images/worktransition.png)

1. **Action Type**: Set the action type to **Execute Command**.
2. **Command**: Specify the path to the PDMShell executable, which is \`pdmcli.exe\`.  
   \`\`\`bash
   "path_to_pdmcli.exe" runscript "pathToScript" [additional parameters]
   \`\`\`

- The \`pathToScript\` must be wrapped in quotes (\`""\`) if it contains spaces.
- Additional parameters can be passed to the script as needed aslo wrapped in quotes (\`""\`).
- Make to sure to check \`Wait until the started program terminates.\`
Example: Workflow Transition Execute Command Configuration

"C:\\Program Files (x86)\\BLUE BYTE SYSTEMS INC\\PDMShell\\PDMCLI.exe" runscript "C:\\Scripts\\clearvariables.pdmshell" "FilePath" 

### Example Script

In the PDMShell script (\`clearvariables.pdmshell\`), you can reference the parameters as follows:

# Check the selected file out
checkout -filePath "$parameter1$"

# clear description variable
setvar -filePath "$parameter1$" -variableName Description -Value ""

# Save changes
checkin -filePath "$parameter1$" -comment "cleared description"
# cd to root folder
cd\\
# cd to logs folder
cd logs
# save log
dump clearvariables_$yyyy-$mm-$dd_$guid.txt
# You must call quit at the end of the script
quit

Tutorial
<video src="https://bluebyte.biz/wp-content/pdmshellvideos/workflowtransition.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>

Tips for Running PDMShell Scripts from Workflow Transitions
- **Test Your Scripts**: Always test your PDMShell scripts independently before integrating them with workflow transitions.
- **Use Quotes for Paths**: Wrap paths and parameters in quotes (\`""\`) if they contain spaces to avoid errors.`,
    keywords: ['scriptsfromtransition', 'notes', 'about', 'running', 'pdmshell', 'scripts', 'workflow', 'transitions'],
    category: 'scripting'
  },
  {
    id: 'search',
    title: 'SEARCH Command',
    content: `DESCRIPTION:
The \`search\` command allows users to search for files and folders in the current directory. It supports recursive searches, filtering, and output customization.

SYNTAX:

search -search -recursive -includesubfolders -csv -columns -duplicatesstrategy

PARAMETERS:
- \`search\`: Search keyword. This supports SQL wildcard %.

- \`recursive\`: Searches through all subdirectories recursively.

- \`includesubfolders\`: Includes subfolders in the search results.

- \`csv\`: Outputs the search results in CSV format.

- \`columns\`: Specifies the columns to include in the output seperated by a comma.

- \`duplicatesstrategy\`: Defines how duplicate results are resolved when DuplicatedBy is specified in the search query. You must \`DuplicatedBy\` token in the \`search\` parameter. 

**Special columns**: You can use \`FileDate\`, \`Version\`, \`State\` and \`Hash\` to list information that is not captured in the datacard. This is useful when searching for duplicates. The hash requires that the file be locally cached. Example:

\`\`\`bash 
lists all duplicates in the current directory by name and prints their file date, hash and revision
search -search "Name=%.sld%;Recursive=true;DuplicatedBy=Name" -columns "FileDate,Hash,Revision"

We have introduced Advanced Search capabilities that can be used in the \`-search\` parameter. Please see more information [here](advancedsearch.md).

EXAMPLES:
### Example 1: Basic Search

search -search % # prints all the files in the current directory

Performs a basic search in the current directory.

### Example 2: Recursive Search with Subfolders

search -search -recursive -includesubfolders # prints all the files and folders in the current directory

Searches all files and folders, including subdirectories.

### Example 3: Export Results to CSV

search -search -csv -columns "Description,PartNumber" # Prints all the files in the current directory with their descriptions and part numbers

Exports the search results to a CSV file with specified columns.

DUPLICATE STRATEGY OPTIONS

The following strategies are supported for the \`-duplicatesstrategy\` parameter:

| Strategy | Description |
|-----------|-------------|
| KeepNewest | Keeps the newest file in each duplicate group. |
| ExcludeNewest | Excludes the newest file and keeps the remaining duplicates. |
| KeepOldest | Keeps the oldest file in each duplicate group. |
| ExcludeOldest | Excludes the oldest file and keeps the remaining duplicates. |
| KeepHighestVersion | Keeps the file with the highest PDM version. |
| ExcludeHighestVersion | Excludes the file with the highest PDM version. |
| KeepLowestVersion | Keeps the file with the lowest PDM version. |
| ExcludeLowestVersion | Excludes the file with the lowest PDM version. |
| KeepLatestRevision | Keeps the file with the latest revision value. |
| ExcludeLatestRevision | Excludes the file with the latest revision value. |
| KeepLargest | Keeps the file with the largest file size. |
| ExcludeLargest | Excludes the file with the largest file size. |
| KeepSmallest | Keeps the file with the smallest file size. |
| ExcludeSmallest | Excludes the file with the smallest file size. |

Lists all duplicates in the current directory by name and prints their file date, hash and revision
search -search "Name=%.sld%;Recursive=true;DuplicatedBy=Name" -duplicatesstrategy KeepNewest -columns "FileDate,Hash,Revision"

![duplicatedby](image.png)

NOTES:
- Ensure the current directory is set correctly before running the command.
- Use the \`-columns\` parameter to customize the output format. Data is pulled from @ for configuration-supported documents.

TUTORIAL:
 <video src="https://bluebyte.biz/wp-content/pdmshellvideos/search.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>`,
    keywords: ['search', 'recursive', 'includesubfolders', 'csv', 'columns', 'duplicatesstrategy', 'duplicatedby', 'filedate', 'version', 'state', 'hash'],
    category: 'search'
  },
  {
    id: 'searchfromsource',
    title: 'SEARCHFROMSOURCE Command',
    content: `DESCRIPTION
The \`searchfromsource\` command reads a **CSV source file** and uses the **first column** (ignoring the header) as input items to search for in the vault. 

For every row in the source CSV, PDMShell performs a vault search and returns information such as:

- File ID  
- Full vault path  
- Parent folder ID  
- Checked-out status  
- Where Used parent file IDs  

Optionally, the command can write the results to a CSV file and add/update that CSV in the vault.

---

SYNTAX

searchfromsource -filePath -recursive -csv

---

PARAMETERS

### \`filePath\`
Path to the **source CSV file** to read input values.

- If the path is **absolute**, PDMShell uses it directly.
- If the path is **relative**, PDMShell combines it with the current directory.

The source file must exist in the vault (so it can be downloaded locally and read).

---

### \`recursive\`
If specified, the search will recursively search through all subfolders.

- When omitted: search is performed in the current directory scope (non-recursive).
- When included: recursive search is enabled.

---

### \`csv\`
Optional output CSV file name/path.

If provided, the command will write the search results to a CSV file containing one row per input item.

Supported behaviors:
- If the CSV file already exists in the vault, PDMShell will attempt to overwrite/update it.
- If the CSV file does not exist, PDMShell will create it and add it to the vault.

---

INPUT CSV FORMAT

The command reads:

- Comma-delimited CSV
- First row is treated as a header and ignored
- Only the **first column** is used

Example:

FileName  
part1.sldprt  
asm_top.sldasm  
drawing1.slddrw  

Notes:
- **THE VALUES CAN BE A SEARCH QUERY. PLEASE SEE** [ADVANCED SEARCH ARTICLE FOR MORE INFORMATION](advancedsearch.md).
- Empty rows are ignored
- Values are trimmed
- Each value becomes the search input token

---

### Input Example 1: Plain file names (most common)

This is the simplest format where the first column contains exact file names:

FileName  
bracket.sldprt  
frame.sldasm  
cover.sldprt  
motor_mount.sldprt  

How it behaves:
- Each row is searched individually
- PDMShell tries to locate the file in the vault (based on your current folder and \`-recursive\` flag)

---

### Input Example 2: File names with extensions mixed (multi-document types)

You can mix parts, assemblies, drawings, PDFs, etc.

FileName  
100023.sldprt  
100023.slddrw  
Datasheet_100023.pdf  
SpecSheet.docx  

How it behaves:
- Each row is treated as a separate lookup item
- Results are returned only if PDM finds a matching file

---

### Input Example 3: Using wildcards (\`%\`) in the input

If your source file contains wildcard patterns, each row can be used as a search token:

Query  

%.sldprt  
%.sldasm  
%.slddrw  

How it behaves:
- Each row becomes its own search query
- Useful for generating bulk reports from common patterns

---

### Input Example 4: Advanced Search expressions in the input

You can pass more powerful search values in the first column (same idea as \`-search\` in the \`search\` command).

Query  

"Name=%.slddrw"  // all drawings 
"Name=%.sldprt;Locked=true" // All parts that are checked out   

How it behaves:
- Each row is passed directly into the search engine
- Results depend on your Advanced Search capabilities and syntax rules

For full syntax and supported fields/operators, see: [advancedsearch.md](advancedsearch.md)

---

OUTPUT CSV FORMAT
When \`-csv\` is used, PDMShell generates the following columns:

ID,FileName,Path,ParentFolderID,ParentFolder,IsCheckedOut,WhereUsedIds

### Column Definitions
- **ID**: PDM file ID returned by search  
- **FileName**: The original value read from the source CSV first column  
- **Path**: Full vault path returned by the search result  
- **ParentFolderID**: Folder ID containing the file  
- **ParentFolder**: Folder path (derived from the result path)  
- **IsCheckedOut**: \`True/False\` based on PDM lock status  
- **WhereUsedIds**: Comma-separated list of parent file IDs (from the reference tree)

---

EXAMPLES

### Example 1: Run search from a source CSV

searchfromsource -filePath "input.csv"

Reads \`input.csv\` and searches each row item.

---

### Example 2: Recursive search

searchfromsource -filePath "input.csv" -recursive

Searches for each item recursively through subfolders.

---

### Example 3: Export results to a CSV file

searchfromsource -filePath "input.csv" -recursive -csv "results.csv"

Writes results into \`results.csv\`.  
If \`results.csv\` exists in the vault, the command attempts to update it.  
If it does not exist, the command creates it and adds it to the vault.

---

NOTES
- This command requires the user to be logged in to a vault.
- The input CSV must be accessible locally (PDM will download the file when needed).
- If the vault search yields no result for a row, the command prints a warning and continues.
- Output CSV values are CSV-escaped (commas, quotes, newlines).
- Where Used results are generated using the reference tree lookup.

---

LIMITATIONS
- Only the first search result is used (\`GetFirstResult()\`).
- Only file results are processed (folder results are ignored).
- The input file is interpreted as comma-delimited CSV only.`,
    keywords: ['searchfromsource'],
    category: 'search'
  },
  {
    id: 'setrevision',
    title: 'SETREVISION Command',
    content: `DESCRIPTION:

The \`SetRevisionCommand\` allows you to set the **PDM-managed revision** of a file inside the vault.  
This command updates the official **PDM Revision** (the value shown on the version tab), *not* the datacard one.

You may set the revision using:
- **%nextrevision%** — moves the revision forward  
- **%previousrevision%** — moves the revision backward  
- **%initial%** — resets to the first revision in the revision scheme  

You can also use **PDM variables** by enclosing them in brackets:  
Example: \`[Revision]\`  
This evaluates the variable on the file and applies its value as the new revision.

The command resolves all bracketed variables before applying the revision.

SYNTAX:

setrevision -filePath|-search -value 

PARAMETERS:

- \`filePath\`  
  Path to the file whose revision you want to update.  
  Only a single file is affected by this command.

- \`search\`  
  Search query in the current folder

- \`value\`  
  The revision value to apply.  
  This can be:
  
  - \`%nextrevision%\` → increments the PDM revision counter  
  - \`%previousrevision%\` → decrements the PDM revision counter  
  - \`%initial%\` → resets revision to the scheme’s first value  
  - \`[VariableName]\` → evaluates the PDM variable and uses its value  
  - A literal revision string supported by the vault’s revision scheme  

- \`csv\` (only valid with \`search\`)
  Save results to a csv file

### NOTES:

- This command affects **only the PDM Revision**, not custom properties or configuration-specific metadata.  
- When using \`[VariableName]\`, ensure the variable is present on the file card.  
- \`%previousrevision%\` will adjust the counter only if the revision scheme allows backward movement.  
- \`%nextrevision%\` respects all revision scheme rules defined in the PDM Administration tool.

# AVAILABILITY 
- 3.0.11`,
    keywords: ['setrevision'],
    category: 'version-control'
  },
  {
    id: 'setrevisionfromsource',
    title: 'SETRECISIONFROMSOURCE Command',
    content: `DESCRIPTION

The \`SetRecisionFromSourceCommand\` allows you to batch-update the **PDM-managed revision** for multiple files by reading values from a CSV input source.

The **source CSV** must contain at minimum:

- **Id** → the PDM file ID  
- **Value** → the revision value to apply  

This command applies the revision exactly as supplied in the CSV just like in the [set revision command](SETREVISION.md).  
It does  **evaluate** \`%nextrevision%\`, \`%previousrevision%\`,\`%initial%\`, or bracketed variables—only literal revision values.

You may optionally output a **results CSV** that includes success/failure information for each processed row.

SYNTAX

setrevisionfromsource -source -csv

PARAMETERS

- \`-source\`  
  Path to the CSV file that contains the input dataset.  
  Required columns:  
  - \`ID\` — the file’s PDM ID inside the vault.  
  - \`Revision\` — the revision string supported by the revision scheme  

![setrevisionfromsource](/images/setrevisionfromsource.png)

 You can generate IDs and variables into a CSV by using the [search command](SEARCH.md).

- \`-csv\` *(optional)*  
  Path to an output CSV file where results will be written.  
  The results file contains:  
  - File ID  
  - Operation status  
  - Error message (if any)

EXAMPLAES

setrevisionfromsource -source source.csv -csv results.csv

NOTES

- This command updates the **PDM Revision** shown on the Version tab, not datacard variables.  
- All revisions must already exist in the active revision scheme.  
- If a file ID does not exist or cannot be updated, the error will be logged and processing continues for the remaining records.  
- Output CSV is optional; if omitted, results are printed to console only.

AVAILABILITY
- 3.0.12`,
    keywords: ['setrevisionfromsource', 'setrecisionfromsource'],
    category: 'version-control'
  },
  {
    id: 'setvar',
    title: 'SETVAR Command',
    content: `DESCRIPTION:
Sets the value of a variable for a specified checked out file or many checked out files.

SYNTAX:

setvar [-filePath|-search]  -variableName -value [-configNames] [-stringformat] 

PARAMETERS:
-\`filePath\`: The file to set the variable for.

-\`variableName\`: The variable to set.

-\`value\`: The value to assign to the variable.

-\`configNames\`: The configuration names to set the variable for, separated by commas.

-\`search\`: The search operation to use.

-\`stringformat\`: string format. See remarks section. 

EXAMPLES:

setvar -filePath file1.sldprt -variableName Description -value $value -stringformat UpperCase # Upper case the current value.

EVALUATION:
The \`value\` parameter gets evaluated by PDMShell. This feature allows you to use placeholders in the new value, which will be replaced with actual values from the file or folder. This can be useful to dynamically generate new values based on file or folder properties or other variables. The following placeholders are supported:

Please read more information about placeholder evaluation [here](EVAL.md).

REMARKS
- The \`configNames\` parameter should be separated by commas. If omitted, PDMShell uses \`@\` for configuration-supported documents.
- The \`search\` parameter searches the current directory and does not drill down. The search query is a PDM one, so you can use \`%\` for wildcard.
- The \`stringformat\` parameter allows you to format the value of the variable using predefined string formatting options. The following formats are supported:
  - **UpperCase**: Converts the entire string to uppercase.
  - **LowerCase**: Converts the entire string to lowercase.
  - **CamelCase**: Converts the string to camel case, where the first word is lowercase, and subsequent words are capitalized (e.g., \`exampleString\`).
  - **FirstLetterCase**: Capitalizes the first letter of the string and converts the rest to lowercase (e.g., \`Example\`).

TUTORIAL:
 <video src="https://bluebyte.biz/wp-content/pdmshellvideos/setvar.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>

CHANGELOGS
- As of version [3.0.9](releasenotes.md), we have added support for setting folder daracard variables`,
    keywords: ['setvar', 'filepath', 'variablename', 'value', 'confignames', 'search', 'stringformat'],
    category: 'variables'
  },
  {
    id: 'setvarsfromsource',
    title: 'SETVARSFROMSOURCE Command',
    content: `DESCRIPTION:
Sets variables for multiple files using a CSV file as the source.

SYNTAX:

setvarsfromsource -source

PARAMETERS:
-\`source\`: The CSV file containing the file IDs and variable values.

CSV FILE FORMAT:
The CSV file should have the following format:

FileID,Variable1,Variable2,... 
XXXX,Value1,Value2,... 
XXXX,Value1,Value2,...

EXAMPLES:

setvarsfromsource -source variables.csv # the source file must be exist in the current directory

REMARKS:
- The CSV file should have the first column as the file ID and the subsequent columns as the variable names.
- You need to include the extension in the filename. This file can be outside the vault.
- The best way to generate a source CSV is to use the \`dir\` command or the \`search\` command on a folder with the \`-csv\` parameter and the \`columns\`, like:

dir -columns Description,"Part Number" -csv data.csv
search -search %.sldprt -recursive -columns Description,"Part Number" -csv data.csv #this will save all parts from all levels in the current directory with the columns Description and Part Number

TUTORIAL:
 <video src="https://bluebyte.biz/wp-content/pdmshellvideos/setvarsfromsource.mp4" autoplay muted controls style="width: 100%; border-radius: 12px;"></video>`,
    keywords: ['setvarsfromsource', 'source'],
    category: 'variables'
  },
  {
    id: 'start',
    title: 'START Command',
    content: `DESCRIPTION:
The \`start\` command is used to launch programs, tools, or specific applications. It supports launching SOLIDWORKS, the PDM administration tool, Notepad, Windows Explorer, and other custom programs. Additionally, it can open the SOLIDWORKS API help file or the current folder in Explorer.

SYNTAX:

start -process -swversion

PARAMETERS:
- **\`process\`**:  
  *(Optional)* Specifies the program to start. Common values include:  
  - \`admin\`: Launches the PDM administration tool.  
  - \`notepad\`: Launches Notepad.  
  - \`apihelp\`: Opens the SOLIDWORKS API help file.  
  - \`explorer\`: Opens Windows Explorer.  
  - \`.\`: Opens the current folder in Windows Explorer.  

- **\`swversion\`**:  
  *(Optional)* Specifies the version of SOLIDWORKS to launch. The year should be provided (e.g., \`2023\`).

EXAMPLES:
  
   \`\`\`bash
# Launch the PDM administration tool.  
   start admin
   \`\`\`

REMARKS:
- **Launching SOLIDWORKS**:  
  If the \`-wversion\` parameter is provided, the command attempts to locate and launch the specified version of SOLIDWORKS. If the version is not found, an error message will be displayed.

- **Administration Tool**:  
  The \`admin\` option launches the PDM administration tool. Ensure the tool is installed and accessible.

- **Notepad**:  
  The \`notepad\` option launches the default Notepad application from the system directory.

- **API Help**:  
  The \`apihelp\` option opens the SOLIDWORKS API help file (\`api_gb.chm\`) from the PDM installation directory.

- **Explorer**:  
  The \`explorer\` option opens Windows Explorer. Using \`.\` opens the current folder.

- **Error Handling**:  
  If the specified program or process cannot be found, an error message will be displayed.`,
    keywords: ['start', 'process', 'admin', 'notepad', 'apihelp', 'explorer', 'swversion', '2023'],
    category: 'system'
  },
  {
    id: 'taskscript',
    title: 'Run Script as a Task',
    content: `Overview

<iframe width="800" height="600" src="https://www.youtube.com/embed/z2UYgREIRpA?si=vD4PfErfZtUb8-cm" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

**This task can be requested upon purchase of a premium license of PDMShell.** To request after purchase, please send an email to support@bluebytesystemsinc.zohodesk.com

---

**TaskScript** is a custom PDM task add-in developed by **Blue Byte Systems Inc.** that allows you to execute **PDMShell scripts** the same way you would use the built-in **Convert** task.

With TaskScript, administrators can create configurable tasks that run custom \`.pdmshell\` scripts using the \`pdmcli\` engine on selected files within the vault.

Key Features

- Execute PDMShell commands in response to PDM task triggers
- Dynamic script editing and variable binding
- Reuses existing scripts stored locally or downloaded
- Supports file filtering based on extensions
- Evaluates placeholders like \`$fileName\`, \`$localPath\`, and more
- Handles script failure with detailed logging

---

PDMShell Scrit page
![TaskScript UI](../images/taskscript.png)

### 1. **Available Scripts (BLUE BYTE SYSTEMS)**

- A dropdown list showing available \`.pdmshell\` scripts.
- These can be downloaded.
- Selecting a script from the list loads it into the editor.

### 2. **Buttons**

- **DOWNLOAD SELECTED**  
  Downloads the currently selected script file.

- **REQUEST A SCRIPT**  
  Opens a preformatted email to \`amen@bluebyte.biz\` with the subject **"Script Request"**.

- **REFRESH**  
  Reloads the available script list.

### 3. Script Editor

- A multi-line editable area for entering or modifying \`.pdmshell\` scripts.
- Lines starting with \`#\` are treated as **comments**.
- Syntax highlighting shows comments in *italic green* for better readability.

### 4. Extensions and test button
 - Specify the extensions to process.
 - **TEST WITH FILE** allows to test your script before running it.
---

Example Script

cd/
print -id $id

You can request a script by emailing us via the Request Script button.

Remarks

- You can include the extensions: \`sldprt;sldasm;slddrw\` are the default value.
- TaskScript will run PDMShell sessions on all affected documents by the task.
- Do not forget to set the Command Menu tab.

Placeholder Variables

TaskScript supports dynamic variables that are replaced at runtime for each selected file. Below is a list of available placeholders:

| Placeholder                  | Description                                              |
|-----------------------------|----------------------------------------------------------|
| \`$localPath\`                | Full local path to the selected file                    |
| \`$fileName\`                 | File name (including extension)                         |
| \`$id\`                       | Internal PDM file ID                                     |
| \`$folderPath\`               | Full local path to the file's parent folder             |
| \`$folderID\`                 | Internal PDM folder ID                                   |
| \`$fileNameWithoutExtension\` | File name without the extension                          |
| \`$vaultName\`                | Name of the vault the file belongs to                   |
| \`$vaultRootFolder\`          | Local root path of the vault                            |
| \`$(Variable.Configuration)\` | Value of a custom PDM variable for a given configuration |

$(Variable.Configuration)
- Use \`@\` for the \`@\` tab. Example: \`$(Description.@)\`
- Use empty string for files with no configurations. Example: \`$(Description. )\``,
    keywords: ['taskscript', 'run', 'script', 'task'],
    category: 'scripting'
  },
  {
    id: 'undocheckout',
    title: 'UNDOCHECKOUT Command',
    content: `DESCRIPTION:
Undoes a checkout operation.

SYNTAX:

undocheckout [-filePath | -search]

PARAMETERS:
- \`filePath\`: The file to undo the checkout for.

- \`search\`: The search operation to use.

EXAMPLES:

undocheckout -f "file1.sldprt"

REMARKS:
- The search parameter searches the current directory and does not drill down. The search query is a PDM one, so you can use \`%\` for wildcard.`,
    keywords: ['undocheckout', 'filepath', 'search'],
    category: 'version-control'
  },
  {
    id: 'updatereferences',
    title: 'UPDATEREFERENCES Command',
    content: `DESCRIPTION
Updates file references inside the SOLIDWORKS PDM vault.

The \`updatereferences\` command modifies references stored **inside files**, without opening SOLIDWORKS, and allows you to:

- Update references for a **single file**
- Update references for **multiple files using a search**
- Resolve references by locating matching files inside a specified directory
- Control which references are updated using a **scope** parameter

This command is especially useful for fixing broken references, updating references after migrations, or correcting references that point outside the vault.

SYNTAX

updatereferences -filepath -search -directory -scope -recursive

PARAMETERS

- \`filepath\`  
  Optional. Updates references for a single file.  
  - If a relative path is provided, it is resolved against the current directory.
  - When specified, the \`search\` parameter is ignored.

- \`search\`  
  Optional. Search query used to find files whose references should be updated.  
  - The search is scoped to the current directory.
  - Supports \`%\` wildcards.
  - Can be combined with \`recursive\`.

- \`directory\`  
  Optional. Defines where replacement references are searched.  
  Only files found under this directory will be used when resolving and updating references.

- \`scope\`  
  Optional. Controls which references are updated.  
  Valid values:
  - \`UpdateOutsideVaultReferenceOnly\` – Updates references that point outside the vault
  - \`UpdateBrokenReferences\` – Updates references that are missing or broken
  - \`UpdateAllReferences\` – Updates all references found in the file

- \`recursive\`  
  Optional. When used with \`search\`, includes subfolders of the current directory when locating files whose references should be updated.

BEHAVIOR

- Operates directly on file reference data
- Does not open SOLIDWORKS
- **Requires files to be checked out**
- Uses vault searches to locate replacement references
- Updates references by matching file names inside the specified directory scope
- Commits changes directly back into the file

EXAMPLES

###  Update only references that point outside the vault

updatereferences -filepath speaker.sldasm -directory Libraries -scope UpdateOutsideVaultReferenceOnly

### Update broken references for all assemblies in the current folder

updatereferences -search %.sldasm -scope UpdateBrokenReferences

 
REMARKS

- Either \`filepath\` or \`search\` must be specified.
- If both are provided, \`filepath\` takes precedence.
- The \`search\` parameter only searches within the current directory unless \`recursive\` is specified.
- Reference resolution is based on matching file names within the directory scope.
- The first matching file found is used to update the reference.
- This command modifies files directly; use with care in controlled workflows.`,
    keywords: ['updatereferences'],
    category: 'file-management'
  },
  {
    id: 'users',
    title: 'USERS Command',
    content: `DESCRIPTION:
Lists all the users in the active vault.

SYNTAX:
\`\`bash
users

PARAMETERS:

EXAMPLES:

users`,
    keywords: ['users'],
    category: 'authentication'
  },
  {
    id: 'version',
    title: 'VERSION Command',
    content: `DESCRIPTION:

Displays version information for PDMShell, installed SOLIDWORKS, or the PDM client.

SYNTAX:

version -solidworks -pdm

PARAMETERS:
- No parameters: Displays the version of PDMShell.

- \`solidworks\`: Displays the versions of installed SOLIDWORKS. **RESERVED FOR FUTURE. NOT IMPLEMENTED**
- \`pdm\`: Displays the version of the installed PDM client. **RESERVED FOR FUTURE. NOT IMPLEMENTED**

PARAMETERS:
SOLIDWORKS - List versions of installed SOLIDWORKS

EXAMPLES:

version -solidworks
# lists all the installed solidworks versions`,
    keywords: ['version', 'solidworks', 'pdm'],
    category: 'system'
  },
  {
    id: 'versionupgrade',
    title: 'VERSIONUPGRADE Command',
    content: `DESCRIPTION:

The \`VersionUpgradeCommand\` provides tools for **bumping PDM revisions**, **validating file references**, and **exporting broken reference results to a CSV file**.

A SOLIDWORKS file upgrade increments the file version and thus the revision. Use \`-bumprevision\` reset to the revision back to the previous value prior to the file upgrade.

This command uses PDM’s internal engine to:

- Increment revision numbers in bulk  
- Detect incorrect, missing, or version-mismatched references  
- Output the reference check results to a CSV file that can be added or updated inside the PDM vault  

The CSV export uses the fields of the \`EdmCheckRef\` structure:

- \`mlParentFileID\`  
- \`mlRefFileID\`  
- \`mbsParentPath\`  
- \`mbsRefPath\`  
- \`mlRefVersion\`  
- \`mlRefLatestVersion\`  
- \`mlRefFolderID\`  

Each result row represents a reference that is out of date, missing, or mismatched according to PDM rules.

---

SYNTAX:

versionupgrade -search <query> [-recursive] [-bumprevision] [-referencescheck] [-csv <fileName>]

---

PARAMETERS:

- \`search\`  
Search query used to locate files for the version upgrade operation.  
If omitted, no files will be processed.

Consult [advanced search](advancedsearch.md) to learn how to create advanced search queries.

- \`recursive\`   
  Searches through all subfolders from the current folder. Not required if using \`Recursive=true\` in \`search\`.

- \`bumprevision\`  
  Increments the PDM revision of each file returned from the search.  
  Requires the logged-in user to have the permission:  
  **Modify revision numbers (EdmSysRight_ModifyRevisionNumbers)**.

- \`referencescheck\`  
  Runs PDM’s **Reference Check**.
  This detects:

  - Missing references  
  - Wrong versions  
  - Outdated references  
  - Broken or invalid reference paths  

   Any issues found are stored in an internal list and may be exported via the \`csv\` parameter.

- \`csv\`  
  Exports reference-check issues to a CSV file.  
  If the file exists in the vault, it is **updated**.  
  If the file does not exist, it is **added** to the vault.

The CSV contains:

ParentFileID,RefFileID,ParentPath,RefPath,RefVersion,RefLatestVersion,RefFolderID

### Behavior notes for CSV:
- Fully-qualified paths inside the vault are handled correctly.  
- CSV escaping is applied (quotes, commas, newlines).  
- UTF-8 encoding without BOM is used for compatibility.  
- If the CSV file is checked out, a warning is returned.

---

WORKFLOW OVERVIEW

### 1. Search for files  
The command executes a PDM search using the supplied query and optional recursion.

### 2. Perform requested operations  
Depending on parameters:

- \`-bumprevision\` → increments the PDM revision counters  
- \`-referencescheck\` → checks all references for correctness  

### 3. CSV Export (optional)  
If both \`search\` and \`referencescheck\` are supplied, and \`csv\` is specified:

- Writes reference errors to a CSV  
- Adds or updates the file in the vault  
- Displays success, warnings, and error messages

---

NOTES:

- \`bumprevision\` and \`referencescheck\` operate *only* on files returned by the search.
- CSV exporting is only active when **both**  
  \`search\` **and** \`referencescheck\` are supplied.
- The reference check output may include many entries depending on assembly depth.
- This command does **not** modify file content — it only updates revision metadata or reference validation results.
- Bulk operations respect PDM permissions and may fail if the user lacks rights.

---

AVAILABILITY  
-  **3.0.13**`,
    keywords: ['versionupgrade', 'search', 'recursive', 'bumprevision', 'referencescheck', 'csv'],
    category: 'version-control'
  },
  {
    id: 'versionupgradefromsource',
    title: 'UPGRADEVERSIONFROMSOURCE Command',
    content: `To be implemented.`,
    keywords: ['versionupgradefromsource', 'upgradeversionfromsource'],
    category: 'version-control'
  },
  {
    id: 'whereused',
    title: 'WHEREUSED Command',
    content: `DESCRIPTION:
The \`whereused\` command lists all parent files that reference a specified file.

This command helps identify assemblies or drawings that use a particular part or subassembly.

The output columns are:

- ChildID  
- ChildName  
- ParentName  
- ParentID  
- FolderPath  

---

SYNTAX:

whereused -filepath|-search -csv

---

PARAMETERS:

- \`filepath\`  
  Full or relative path of the file to evaluate.

- \`search\`  
  Optional filter applied to parent results. Supports SQL wildcard \`%\`.

- \`csv\` csv file name to put the results in CSV format.

---

EXAMPLES:

### Example 1: Basic Where Used

Lists all parent files that reference \`Bracket.SLDPRT\`.
whereused -filepath "C:\\Vault\\Parts\\Bracket.SLDPRT"

---

### Example 2: Filter Parent Results

whereused -search "%.SLDASM"
Finds the parents of all the assemblies in the current directory.

---

### Example 3: Export to CSV

whereused -filepath "C:\\Vault\\Parts\\Bracket.SLDPRT" -csv parents.csv
Exports results to CSV with columns:
ChildID,ChildName,ParentName,ParentID,FolderPath`,
    keywords: ['whereused', 'filepath', 'search', 'csv'],
    category: 'search'
  }
]
