export interface DocChunk {
  id: string
  title: string
  content: string
  keywords: string[]
  category: string
}

export const pdmshellDocs: DocChunk[] = [
  {
    "id": "addtovault",
    "title": "ADDTOVAULT Command",
    "content": "DESCRIPTION:\nThe `addtovault` command is used to add files and/or directories to the SOLIDWORKS PDM vault. It supports multiple input methods including direct file paths, folders, and CSV mapping maps. Additional options allow batch processing, filtering, ignoring existing files, updating references, and exporting results.\n\nIt is highly recommended that you run PDMShell as **Administrator** before using this command.\n\n---\n\nSYNTAX:\n\naddtovault [-source <path> | -map <csvPath>]  [-skip] [-count] | [-directory <Vault or outside directory>] [-search <pattern>] [-recursive] [-batch <size>] [-ignoreexisting] [-updaterefs] [-csv <outputPath>] [-propertymap] [-clear] [-label]\n\n---\n\nPARAMETERS:\n\n- `source`:\nSpecifies the source file or directory to be added to the vault.\n\nSupports:\n\n• Single file  \n• Folder  \n\nIf a folder is specified, files can be filtered using `-search` and `-recursive`.\n\nIf not specified, the current working directory is used.\n\n---\n\n- `map`:\n\nSpecifies a CSV file containing file mapping information.\n\nThe CSV must contain **two columns** (First row is header):\n\nColumn 1: Full source file path  \nColumn 2: Destination folder path relative to the target vault directory  \n\nExample CSV:\n\nFilePath,Target\nC:\\Data\\Part1.sldprt,ProjectA\\Mechanical  \nC:\\Data\\Part2.sldprt,ProjectB\\Mechanical  \n\nWith `-map`, you skip a specified number of items using `-skip` to start from a starting index in your map file. You can limit the number of items to process using the `-count`. \n\n```bash \n#uses a map file and starts from the index 5234 only processing 540 mappings\naddtovault -map \"C:\\Users\\hawkridge\\Downloads\\map\\map.csv\" -batch 50 -propertymap \"C:\\Users\\hawkridge\\Downloads\\map\\property.csv\" -skip 5243 -count 540 -clear -ignoreexisting -csv \"result.csv\"\n\nThis parameter overrides `-source`.\n\nPlease make sure you don't have duplicates copies to the **same** target directory. \n\n---\n\n- `directory`:\n\nSpecifies the destination folder in the PDM vault.\n\nIf not specified, the current vault directory is used.\n\nExample:\n\n-directory \"Projects\"\n\n---\n\n- `search`:\n\n(Optional)\n\nFile Explorer search pattern used to filter files when `-source` is a folder.\n\nSupports:\n\n• Wildcards (`*`)  \n• Multiple extensions  \n• Separators: `,` `;` `|`\n\nExamples:\n\n-search \"*.sldprt\"  \n-search \"*.sldprt;*.sldasm\"  \n\n---\n\n- `recursive`:\n\n(Optional)\n\nIncludes all subfolders when the source is a folder.\n\nIf not specified, only the top-level folder is processed.\n\n---\n\n- `batch`:\n\n(Optional)\n\nSpecifies the number of files to add per batch.\n\nThis improves performance and stability when adding large numbers of files.\n\nExamples:\n\n-batch 50  \n-batch 100  \n\nIf not specified, all files are added in a single batch. \n**Please use a batch size when processing large directory +1000 files. We recommend a batch size of 100**.\n\n---\n\n- `ignoreexisting`:\n\n(Optional)\n\nIgnores files that already exist in the vault.\nPrevents duplicate additions and overwriting.\n\n---\n\n- `updaterefs`:\n\n(Optional)\n\nUpdates file references after files are added.\n\nThis is recommended when migrating SOLIDWORKS assemblies to ensure references point to the correct vault locations.\n\n---\n\n- `label`:\n\n(Optional)\n\nAdds a label to the migrated files. This is a great option to mark the added files immediately. \n\n#Add files from a map (skip first 10 and only process 3) and add a label migration name and value \naddtovault -map \"C:\\export\\map.csv\" -skip 10 -count 3 -label \"Migration;Migration\"\n# finds the added files (parts)\nsearch -search \"Name=%.sldprt;Label=Migration;Recursive=true\"\n\n![label](/images/label.png)\n---\n\n- `csv`:\n\n(Optional)\n\nExports the results of the add operation to a CSV file.\n\nExample:\n\n-csv \"C:\\Reports\\add_results.csv\"\n\n---\n\n- `propertymap`: \nA csv file path containing a list of files and their properties. Use [DocManProps](DOCMANPROPS.md) to generate a list and edit in excel. \n\n-csv \"C:\\Reports\\propertymap.csv\"\n\nYou only need the columns that marked in red:\n\n![Example of property map file](/images/propertymap.png)\n\nIf you specify the word \"DELETE\" as the value, PDMShell will delete that property from in the migrated file during the add operation. **The original file will not be affected**.\n\nIf you specify `-clear`, PDMShell will clear all the properties from the file before adding it to the vault and prior to apply the property map. \n\n---\n\nEXAMPLES:\n\nAdds a single file to the current vault directory:\n\naddtovault -source \"C:\\Projects\\file.txt\"\n\n---\n\nAdds all parts and assemblies recursively:\n\naddtovault -source \"C:\\Projects\" -recursive -search \"*.sldprt;*.sldasm\"\n\n---\n\nAdds files using a CSV mapping file in batches of 50:\n\naddtovault -map \"C:\\Projects\\mapping.csv\" -batch 50\n\n---\n\nAdds files and exports results:\n\naddtovault -source \"C:\\Projects\" -recursive -csv \"C:\\Reports\\results.csv\"\n\n---\n\nAdds files and updates references:\n\naddtovault -source \"C:\\Migration\" -recursive -updaterefs\n\n---\n\nAdds files to a specific vault folder:\n\naddtovault -source \"C:\\Projects\" -directory \"Projects\"\n\nAdd files from a map CSV (50 at a time) and save the results to ret.csv, while ensuring properties are updated using a property map CSV file. This also performs a search and ignores files that already exist in the vault.\n\naddtovault -map \"c:\\export\\map.csv\" -ignoreexisting -csv \"ret.csv\" -batch 10 -propertymap \"c:\\export\\propertymap.csv\"\n\n---\n\nREMARKS:\n\n• Files are left **checked out** after being added.\n• Use `checkin` command to check in files after adding.\n\nExample:\n\ncheckin -search % -recursive\n\n---\n\n• Batch processing is strongly recommended for large migrations.\n\n• The `ignoreexisting` parameter prevents duplicate files from being added.\n\n• The `updaterefs` parameter should be used when adding SOLIDWORKS assemblies.\n\n• Ensure you have sufficient vault permissions before running this command.\n\n• The `map` parameter overrides `source` if both are specified.\n\n---\n\nIt is recommended to perform large add operations in stages and verify results using the exported CSV report.",
    "keywords": [
      "addtovault",
      "source"
    ],
    "category": "file-management"
  },
  {
    "id": "advancedsearch",
    "title": "PDMShell Advanced Search Guide",
    "content": "PDMShell provides a complete search engine based on PDM's own search. This feature is extremely useful with commands that have a `-search` parameter. \n\nThis guide explains how the `-search` parameter works, how to use tokens, variables, operators, and how PDMShell parses and applies search rules.\n\n# Wildcards in PDMShell (SQL-Style Pattern Matching)\n\nPDMShell supports the same wildcard patterns used in SOLIDWORKS PDM and standard SQL-like matching rules. These allow you to control how filenames are matched inside any `-search` query.\n\n| Wildcard | Meaning | Example | Result |\n|----------|---------|---------|--------|\n| `%` | Matches **zero or more characters** | `%.sldprt` | Returns all part files |\n| `_` | Matches **exactly one character** | `pump_.sldprt` | Matches `pump1.sldprt`, `pumpA.sldprt`, **not** `pump10.sldprt` |\n\n1. Overview\n\nThe `-search` parameter accepts simple text queries or advanced multi-condition expressions that filter files and folders using PDM system tokens and variable values.\n\n2. Simple Searches\n\nIf no operators are present, the entire input is treated as a Name filter.\n\nExamples:  \n\npump.sldprt     # Searches for files explicitly named pump.sldprt\nassembly_1001   # Searches for any file whose name contains 'assembly_1001'\n%.sldasm        # Searches for all SOLIDWORKS assembly files in the current folder\n\nEquivalent to: \n\n```bash \nName=pump.sldprt\nName=passembly_1001\nName=%.sldasm  \n\n3. Advanced Syntax\n\nMultiple conditions are separated using semicolons.\n\nExample:\n\nName=%Pump%;Recursive=true;VersionsBefore=20200101   # Finds files with 'Pump' in the name, searches subfolders, and only returns versions created before Jan 1st 2020\n\nDates must follow the `yyyMMdd` format.\n\nEscaping rules:  \n```bash \n\\; inserts a semicolon  \n\\= inserts an equals sign  \n\\\\ inserts a literal backslash\n\nExample:  \n\nName=Valve\\=A;Label=Released\\;Approved   # Searches for files literally named \"Valve=A\" and having a label containing the text \"Released;Approved\"\n\n4. Built-in Search Tokens\n\nThese tokens map directly to EdmSearchToken values and control how PDMShell filters PDM objects.\n\n### Table: Supported Search Tokens\n\n| Token | Description |\n|-------|-------------|\n| Name | File or folder name filter |\n| AllVersions | Search all versions |\n| ContentText | Full-text content search string |\n| ContentTextExact | Exact match of content |\n| ContentTextInBody | Search inside file body |\n| ContentTextInProperties | Search in custom properties |\n| ContentTextOr | Match any word |\n| FindFiles | Include files in results |\n| FindFolders | Include folders in results |\n| FindItems | Include items in results |\n| FolderID | Starting folder ID |\n| HistoryAfter | Search history after date |\n| HistoryBefore | Search history before date |\n| HistoryString | History string search |\n| HistoryStringConfiguration | Search configuration names |\n| HistoryStringFileName | Search file names in history |\n| HistoryStringLabels | Search labels in history |\n| HistoryStringRevisionComment | Search revision comments |\n| HistoryStringStateComment | Search state change comments |\n| HistoryStringVariableValues | Search variable changes |\n| HistoryStringVersionComment | Search version comments |\n| Label | Search label text |\n| LabelAfter | Labels after date |\n| LabelBefore | Labels before date |\n| LabelByUser | Labels created by user |\n| LabelComment | Search label comment |\n| Locked | Return checked-out files |\n| LockedBy | Return files locked by user |\n| Recursive | Include subfolders |\n| StateAfter | State changes after date |\n| StateBefore | State changes before date |\n| StateByUser | User who changed state |\n| StateHistoric | Search historic states |\n| StateID | Workflow state ID |\n| StateName | Workflow state name |\n| Unlocked | Return checked-in files |\n| VersionComment | Search version comment |\n| VersionsAfter | Versions after date |\n| VersionsBefore | Versions before date |\n| VersionsByUser | Versions created by user |\n| WorkflowName | Search by workflow name |\n| **DuplicatedBy** | **Finds duplicates either by name, variables, hash and filedate** |\n| **Edit** | **Performs a checkout and a check-in on the search results. Only use with `export` and `runswmacro` commands.** |\n#### Edit\n\nUse the `edit` token to check out and check-in the search results with the `export` and `runswmacro`'s -`search` parameter. If specify `Edit=Force`, the check-in process will be forced.\n\n# run rebuild macro on all parts in the current directory and force a check out and checkout using SOLIDWORKS 2023\nrunswmacro -search \"Name=%.sldprt;Edit=Force\" -filePath rebuild.swp -timeout 500 -version 2023\n\n#### Duplicates\n\nYou can use `DuplicatedBy` to list the items either filename, variable, ash or last date the file was modified. To use the hash, files must be locally cached. \n\n# finds all solidworks duplicate solidworks files by name and list their file date, hash and revision variable\nsearch -search \"Name=%.sld%;Recursive=true;DuplicatedBy=Name\" -columns \"FileDate,Hash,Revision\"\n\n# finds all solidworks duplicate solidworks files by revision and list their file date, hash and revision variable\nsearch -search \"Name=%.sld%;Recursive=true;DuplicatedBy=@Revision\" -columns \"FileDate,Hash,Revision\"\n\n5. Default Behavior\n\n`FolderID` defaults to the active directory.  \n`Recursive` defaults to the global flag.  \n`FindFolders` defaults to the includefolders flag.  \n`FindFiles` is always true.\n\n6. Variable Search\n\nConditions beginning with @ use PDM variables.\n\nFormat: \n```bash  \n@VariableName Operator Value\n\nExamples:  \n\n@Description=Pump      # Variable 'Description' must equal \"Pump\"\n@Weight>=10            # Numeric variable 'Weight' must be greater than or equal to 10\n@Revision!=A           # Variable 'Revision' must NOT be \"A\"\n@Material~Steel        # Variable 'Material' must contain the text \"Steel\"\n@ProjectCode!~TEST     # Variable 'ProjectCode' must NOT contain the text \"TEST\"\n\nYou can chain mutiple variables. The chain of variables uses the AND operator:\n\n@Description=Pump.sldprt;@Weight>=10      # Part files named pump that have weight above 10\n\n7. Supported Variable Operators\n\nPDMShell supports all major comparison operators for variables.\n\n### Table: Supported Operators\n\n| Symbol | Meaning |\n|--------|---------|\n| = | Equal |\n| != | Not equal |\n| <> | Not equal |\n| > | Greater than |\n| < | Less than |\n| >= | Greater or equal |\n| <= | Less or equal |\n| ~ | Contains |\n| !~ | Does not contain |\n\n8. Variable Operator-to-Enum Mapping\n\n### Table: String Variable Operator Mapping\n\n| Symbol | Enum |\n|--------|------|\n| = | Equals |\n| != / <> | Different |\n| > | Greater |\n| < | Less  |\n| >= | Greater or equal |\n| <= | Less or equal |\n| ~ | Contains |\n| !~ | Not contains |\n\n### Numeric and date types use the corresponding numeric/date enum sets.\n\nDates must be in the format: yyyyMMdd\n\n9. Operator Detection\n\nOperators are detected longest-first to avoid ambiguity.\n\n### Table: Operator Detection Order\n\n| Order | Operator |\n|-------|----------|\n| 1 | >= |\n| 2 | <= |\n| 3 | != |\n| 4 | <> |\n| 5 | !~ |\n| 6 | ~ |\n| 7 | > |\n| 8 | < |\n| 9 | = |\n\nThis ensures >= is not incorrectly parsed as >.\n\n10. Combining Tokens and Variables\n\nTokens and variable conditions can be mixed:\n\nName=%Pump%;@Description~Steel;StateName=Released;@Weight>=5   # Files with names containing 'Pump', description containing 'Steel', state equal to Released, and weight >= 5\n\nAll conditions must match.\n\n11. Invalid Input Handling\n\nInvalid expressions are ignored silently. PDMShell continues applying valid conditions.\n\nExamples ignored:\n```bash \n@MissingVar=Test  \nHistoryBefore=BADDATE  \nUnknownKey=Value  \n\n12. Examples\n\nSearch by name:\n\nName=%Valve%\n# Finds all files whose name contains 'Valve'\n\nSearch by folder:\n\nName=%Valve%;FolderID=102          \n# Same search, but restricted to folder with ID 102\n\nVariable contains:\n\n@Description~Pump                \n# Matches files where Description contains the text 'Pump'\n\nToken and variable together:\n\nStateName=Approved;@Revision!=A  \n# Files in state 'Approved' AND Revision variable not equal to 'A'\n\nMore complex:\n\nName=%Pump%;@Material~Steel;@Weight>=15;Recursive=true;VersionsBefore=20200101\n# Files with 'Pump' in the name, Material containing 'Steel', Weight >= 15,\n# include subfolders, and versions created before Jan 1st 2020\n\n13. Technical support\n\nPlease reach out to us if you have a premium license or considering getting one from our contact [page](https://bluebyte.biz/contact) on our main website.",
    "keywords": [
      "advancedsearch",
      "pdmshell",
      "advanced",
      "search",
      "guide"
    ],
    "category": "search"
  },
  {
    "id": "allpartnumbersandescriptions",
    "title": "\"SQL Example",
    "content": "Retrieving File Metadata from SOLIDWORKS PDM\n\nThe following SQL query extracts metadata from a SOLIDWORKS PDM vault database. It returns file information including folder path, workflow state, configuration, and variable values such as **Drawing No** and **Description**.\n\nThis type of query is useful when building **reports, migrations, or integrations used with PDMShell automation**.\n\nChange `bluebyte` with your vault name to run the query below:\n\nSELECT \n    D.DocumentID,\n    P.ProjectID  AS [Folder], \n    P.Path  AS [Relative Path], \n    P.Name AS [Folder Name],\n    D.Filename, \n    C.ConfigurationName AS [Configuration],\n    S.Name AS [State],\n    V1.ValueText AS [Drawing No], \n    V2.ValueText AS [Description],\n    D.LatestRevisionNo AS [Latest Version]\nFROM [bluebyte].[dbo].[Documents] D\nLEFT JOIN [bluebyte].[dbo].[Status] S ON D.CurrentStatusID = S.StatusID\nLEFT JOIN [bluebyte].[dbo].[DocumentsInProjects] PD ON D.DocumentID = PD.DocumentID\nLEFT JOIN [bluebyte].[dbo].[Projects] P ON PD.ProjectID = P.ProjectID\nCROSS JOIN [bluebyte].[dbo].[DocumentConfiguration] C \nLEFT JOIN [bluebyte].[dbo].[VariableValue] V1 ON V1.DocumentID = D.DocumentID \n    AND V1.ConfigurationID = C.ConfigurationID\n    AND V1.RevisionNo = D.LatestRevisionNo\n    AND V1.VariableID = (SELECT VariableID FROM [bluebyte].[dbo].[Variable] WHERE VariableName = 'Drawing No')\nLEFT JOIN [bluebyte].[dbo].[VariableValue] V2 ON V2.DocumentID = D.DocumentID \n    AND V2.ConfigurationID = C.ConfigurationID\n    AND V2.RevisionNo = D.LatestRevisionNo\n    AND V2.VariableID = (SELECT VariableID FROM [bluebyte].[dbo].[Variable] WHERE VariableName = 'Description')\nWHERE (D.Filename LIKE '%.sldprt' OR D.Filename LIKE '%.sldasm' OR D.Filename LIKE '%.slddrw')\n  AND D.Deleted = 0\n  AND C.ConfigurationName = '@';\n\nOutput\n\n![sqloutput](/images/sqloutput.png)\n\nNotes\n\nSQL queries can be more efficient than the PDM Search API when exporting 1000+ results (reporting / migrations / integrations).\nUse this approach for read-only extraction. Do not write to the PDM database directly.",
    "keywords": [
      "allpartnumbersandescriptions",
      "sql",
      "example"
    ],
    "category": "general"
  },
  {
    "id": "bom",
    "title": "BOM Command",
    "content": "DESCRIPTION:\n\nThe `BOMCommand` allows you to extract a Bill of Materials from a SOLIDWORKS file inside the PDM vault and export it to a CSV file.  \nThis command supports configuration evaluation using **$configuration**, allows specifying **configNames**, and supports selecting a **layout** from all available BOM layouts.\n\nSYNTAX:\n\nbom -filePath -name -directory -configNames -layout\n\nPARAMETERS:\n\n- `filePath`  \n  Path to the SOLIDWORKS file whose BOM you want to export.\n\n- `name`  \n  The base name for the exported CSV file.  \n  Supports evaluation (e.g., `$configuration`).  \n  [More information here](EVAL.md).\n\n- `directory`  \n  Target folder where the CSV will be saved.\n\n- `configNames`  \n  Comma-separated list of configurations to extract the BOM from. If unspecified, all configurations are processed. \n  Example: `@,Default,Manufacturing`.\n\n- `layout`  \n  A comma-separated list of BOM layout names to export.  \n  Example: `Engineering,Manufacturing`.  \n  PDMShell validates layout names against PDM before exporting.",
    "keywords": [
      "bom"
    ],
    "category": "export"
  },
  {
    "id": "cd",
    "title": "CD Command",
    "content": "DESCRIPTION:\nChanges the current PDM directory.\n\nSYNTAX:\n\ncd [-directory|-id]\n\nPARAMETERS:\n-`directory`(or `d`): The directory to switch to. The directory parameter can be a relative or absolute path in PDM.\n-`id`: ID of the folder to navigate to.\n\nEXAMPLES:\n\ncd -directory 'C:\\Vault\\NewFolder' # Navigates its newFolder\n\nREMARKS:\n- Please be aware of the following special ways to change directory:\n\ncd.. # Navigates to the parent folder\ncd\\  # Navigates to the root of the vault\n\n- If the user just created a new folder and wants to `cd` to it using autocomplete, they need to use the `dir` command with the `-refresh` parameter to force the session to load the current files and sub-folders in the active directory. Using `-refresh` might affect the performance of the session if the current folder has too many files and sub-folders.\n- `directory` is the default parameter. You do not need to specify it if it is the only parameter in your command. \nExample: \n\ncd api #navigates to the api folder\ncd -id 755 #navigates to the folder with id 755\n\nTUTORIAL:\n <video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/cd.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>",
    "keywords": [
      "cd",
      "directory",
      "id"
    ],
    "category": "navigation"
  },
  {
    "id": "checkin",
    "title": "CHECKIN Command",
    "content": "DESCRIPTION:\nPerforms a check-in operation on a specified file or many files.\n\nSYNTAX:\n\ncheckin -search -filePath -comment -Checkinoptions\n\nPARAMETERS:\n- `search`: The search operation to use.\n\n- `filePath`: The file(s) to be checked in. This is the default parameter.\n\n- `comment`: The comment to add to the check-in.\n\n- `Checkinoptions`: The check-in options to use.\n\nEXAMPLES:\n\ncheckin -filePath \"file1.sldprt\"\n\nREMARKS:\n- The search parameter searches the current directory and does not drill down. The search query is a PDM one, so you can use `%` for wildcard.\n- If combining `Checkinoptions` parameters, the user needs to add `+` between the values.\n\n### Checkinoptions Parameter Values:\n\n| Member                                    | Description                                                                                                      |\n|-------------------------------------------|------------------------------------------------------------------------------------------------------------------|\n| EdmUnlock_FailOnRegenerationNeed          | Fail if the file needs to be regenerated in the CAD program. NOTE: Only files resaved in SOLIDWORKS 2009 or later can trigger this flag |\n| EdmUnlock_ForceUnlock                     | Unlock the file even if it is not modified                                                                       |\n| EdmUnlock_IgnoreCorruptFile               | Ignore files with file formats unrecognized by SOLIDWORKS PDM Professional; without this flag, SOLIDWORKS PDM Professional returns E_EDM_INVALID_FILE if it encounters a corrupt file or a file containing a newer format than SOLIDWORKS PDM Professional can handle |\n| EdmUnlock_IgnoreReferences                | Silently unlock parent files without their references                                                            |\n| EdmUnlock_IgnoreRefsNotLockedByCaller     | Ignore references not locked by caller                                                                           |\n| EdmUnlock_IgnoreRefsOutsideVault          | Ignore references to files outside the vault                                                                     |\n| EdmUnlock_KeepLocked                      | Keep the file checked out after creating the new version in the archive                                          |\n| EdmUnlock_OverwriteLatestVersion          | Do not create a new version; overwrite the last version of the file with new changes                             |\n| EdmUnlock_RemoveLocalCopy                 | Remove the local copy of the file from the hard disk after the file has been checked in                          |\n| EdmUnlock_Simple                          | Check in the file using default behavior                                                                         |",
    "keywords": [
      "checkin",
      "search",
      "filepath",
      "comment",
      "checkinoptions"
    ],
    "category": "version-control"
  },
  {
    "id": "checkout",
    "title": "CHECKOUT Command",
    "content": "DESCRIPTION:\nPerforms a check out operation on a specified file or many files.\n\nSYNTAX:\n\ncheckout -search -recursive -filePath\n\nPARAMETERS:\n-`search`: Search keyword\n\n-`filePath`: The file(s) to be checked out. This is the default parameter\n\n-`recursive`: Recursively check out all files in the current directory. Use in combination with search\n\n-`checkoutoptions`: Optional. Use this to check a file and its references at once:\n\n| Option Name (CLI)              | Description |\n|--------------------------------|-------------|\n| Nothing                        | No checkout options are applied. |\n| AsBuilt1                       | Uses the same versions of referenced files that were used when the referencing file was checked in; otherwise, the latest versions are used. |\n| SkipUnlockedWritable           | Does not retrieve files that are writable and not checked out. |\n| SkipExisting                   | Does not retrieve files that already exist in the local cache. |\n| ForPreview                     | Retrieves only referenced files required for preview; skips caching referenced files. |\n| RefreshFileListing             | Refreshes the File Explorer listing after files have been checked out. |\n| LockReferencedFilesToo         | Checks out (locks) files referenced by the checked-out file. |\n| AsBuiltNotDefault              | Uses the as-built versions when creating the reference tree. |\n| SkipOpenFileChecks             | Skips checking whether files are open in another application. |\n| SkipLockRefFiles               | Skips checking of lock file references. |\n| LockNoLclCopyFiles             | Locks referenced files even if no local cache copy exists. |\n| IncludeAutoCacheFiles          | Automatically caches referenced files if the latest version is not already in the local cache. |\n| RollbackTree                   | Provides the ability to roll back files in the checkout dialog. |\n| ForViewer                      | Retrieves only referenced files required by the viewer; skips caching referenced files. |\n| SingleFileRollback             | Rolls back a single file. |\n| XrefsOpenCheck                 | Checks whether cross-reference files are open in another application. |\n\nYou combine values by using `+`. Please make sure to wrap the parameter value in \"\". Example: `\"SkipExisting + LockReferencedFilesToo\"`\n\nEXAMPLES:\n\ncheckout -filePath file1.sldprt\n\nREMARKS:\n- The search parameter searches the current directory and does not drill down. The search query is a PDM one, so you can use `%` for wildcard.\n\nTUTORIAL:\n <video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/checkout.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>",
    "keywords": [
      "checkout",
      "search",
      "filepath",
      "recursive",
      "checkoutoptions"
    ],
    "category": "version-control"
  },
  {
    "id": "clearcache",
    "title": "CLEARCACHE Command",
    "content": "DESCRIPTION:\nClears the local cache of a folder or many files.\n\nSYNTAX:\n\nclearcache -directory -search -toolboxflag -source\n\nPARAMETERS:\n- `-directory`: The directory to clear the local cache of.\n- `-search`: Search query.\n- `-toolboxflag`: Ignore toolbox files.\n- `-source`: CSV files containing complete local file paths to clear. First row is header.\n\nEXAMPLES:\n\nclearcache -search \"*.sldprt\"\n# Clears the cache of all `.sldprt` files in the current directory.\n\nclearcache -directory project -toolboxflag\n# Clears the directory called project whiling ignore toolbox files.\n\nclearcache -source \"source.csv\"\n# Clears the cache for the specified source.",
    "keywords": [
      "clearcache"
    ],
    "category": "system"
  },
  {
    "id": "cls",
    "title": "CLS Command",
    "content": "DESCRIPTION:\nClears the current session.\n\nSYNTAX:\n\ncls\n\nPARAMETERS:\n\nCommand has no parameters.\n\nEXAMPLES:\n\ncls\n\nREMARKS\n- You can alternatively set the Line Limit Count from the settings to remind the session to clear every count of lines.",
    "keywords": [
      "cls"
    ],
    "category": "system"
  },
  {
    "id": "copy",
    "title": "COPY Command",
    "content": "DESCRIPTION\nPerforms a vault-to-vault copy operation in SOLIDWORKS PDM.\n\nThe `copy` command creates **new files with new File IDs** inside the vault by copying:\n- A single file\n- All files in a folder\n- Files found using a search scoped to a source folder\n\nThis command does **not** add files from disk and does **not** modify the original files.\n\nSYNTAX\n\ncopy -source -directory -search -recursive -name -ignoreexisting\n\nPARAMETERS\n\n- `source`  \n  The source file or folder inside the vault.  \n  - If a file path is provided (ends with an extension), only that file is copied.\n  - If a folder path is provided, all matching files in that folder are copied.\n  - Relative paths are resolved against the current folder.\n\n- `directory`  \n  The destination folder inside the vault where files will be copied.\n\n- `search`  \n  Optional PDM search keyword used to filter files in the source folder.  \n  The search is scoped to the source folder and supports `%` wildcards.\n\n- `recursive`  \n  Optional. When used with `search`, includes subfolders of the source folder.\n\n- `name`  \n  Required. Specifies the destination file name.  \n  [Alias expressions are evaluated **only for the destination name**](EVAL.md). Extension required.\n\n- `ignoreexisting`  \n  Not implemented\n\nEXAMPLES\n\n### Copy a single file to another folder\n\ncopy -source part1.sldprt -directory /Vault/Projects/Released -name part2.sldprt\n\n### Copy a file and rename it\n\ncopy -source part1.sldprt -directory /Vault/Projects/Released -name part1_revA.sldprt\n\n### Copy all files from a folder\n\ncopy -source Vault/Projects/WIP -directory /Vault/Projects/Released -name \"$namewithouextension-new$extension\"\n\n### Copy files using a search filter\n\ncopy -source Vault/Projects/WIP -search %.slddrw -directory Vault/Projects/Released -name \"$namewithouextension-new$extension\"\n\n### Copy files and append new to the old name\n\ncopy -source Vault/Projects/WIP -search %.sldprt -directory Vault/Projects/Released -name \"$namewithouextension-new$extension\"\n\nREMARKS\n\n- If `source` is a file, `search` and `recursive` are ignored.\n- If `source` is a folder and `search` is not provided, all files in that folder are copied.\n- The `search` parameter does not search the entire vault, only the source folder",
    "keywords": [
      "copy"
    ],
    "category": "file-management"
  },
  {
    "id": "copytree",
    "title": "COPYTREE Command",
    "content": "DESCRIPTION:\nThe `copytree` command is used to copy files and their associated metadata from a source directory or search results, with options to apply prefixes, suffixes, and other filters. This only works with assembly files.\n\nSYNTAX:\n\ncopytree [-search|-filePath] -suffix -prefix -recursive -includedrawings -latest -directory\n\nPARAMETERS:\n- `-filePath`: The source file or directory to copy.  \n- `-directory`: Specifies the target directory where the files will be copied.  \n- `-search`: A search query to filter files to be copied.  \n- `-suffix`: Adds a suffix to the copied files.  \n- `-prefix`:  Adds a prefix to the copied files.  \n- `-recursive`: Copies files recursively from subdirectories.  \n- `-includedrawings`: Includes associated drawing files in the copy operation.  \n- `-latest`: Ensures the latest version of the files is copied.\n\nEXAMPLES:\n ```bash\n   copytree -filePath \"fidget spinner.sldasm\" -suffix _ -directory \"\\new project\" #copies the fidget spinner to new project folder with suffix _\n   copytree -search \"*.sldasm\" -includedrawings -directory \"c:\\export\" #copies all assemblies in current directory to the export under c drive\n   ```\n\nREMARKS:\n- The `-dir` parameter specifies the target directory. If omitted, the current directory is used.\n- Use the `-recursive` parameter to include all subdirectories in the operation.\n- The `-includedrawings` parameter ensures that associated drawing files are included in the copy.\n- The `-latest` parameter ensures that only the latest versions of files are copied.",
    "keywords": [
      "copytree"
    ],
    "category": "file-management"
  },
  {
    "id": "delete",
    "title": "delete all parts in the current directory",
    "content": "# DELETE Command Documentation\n\nDESCRIPTION:\nThe `delete` command is used to delete files or directories from the PDM system. It supports various parameters to specify the target files or directories, including file paths, directory paths, search queries, and IDs. The command also supports recursive deletion for directories.\n\nSYNTAX:\n\ndelete [-filePath|-id] -directory -search -recursive -list -csv\n\nPARAMETERS:\n\n- `filePath`:\n(Optional) Specifies the file path of the file to be deleted.\n\n- `directory`: \n(Optional) Specifies the directory to be deleted. If used with the -recursive parameter, all files and subdirectories within the directory will also be deleted.\n\n- `search`:\n(Optional) A search query to filter files or directories to be deleted.\n\n- `id`:\n(Optional) Specifies the ID of the file to be deleted.\n\n- `recursive`:\n(Optional) Deletes all files and subdirectories within the specified directory. This parameter is only applicable when deleting directories.\n\n- `list`:\n(Optional) Lists all the deleted files. Specifying `recursive` with this parameter will do a drill down search and fetch all deleted files.\n\n- `csv`: Exports a list of deleted files to a csv. This only works if `list is specified`. \n\n- `destroy`: If specified, the deleted file will be also destroyed. `-destroy` only affects results from the `search` parameter.\n\nUse the exported csv from -csv with the [recover](RECOVER.html) command.\n\n `-destroy` only affects results from the `search` parameter. \n\nEXAMPLES:\nDelete files matching a search query:\n\ndelete -search \"%.sldprt\"\n\nREMARKS:\n- The delete command requires at least one of the following parameters: `filePath`, `dir`, `search`, or `id`.\n- Use the `recursive` parameter with caution, as it will delete all contents within the specified directory.\n- Ensure you have the necessary permissions to delete files or directories in the PDM system.\n\nTUTORIAL:\n <video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/delete.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>",
    "keywords": [
      "delete",
      "all",
      "parts",
      "current",
      "directory",
      "filepath",
      "search",
      "id",
      "recursive",
      "list",
      "csv",
      "destroy"
    ],
    "category": "file-management"
  },
  {
    "id": "deletefromsource",
    "title": "DELETEFROMSOURCE Command",
    "content": "DESCRIPTION:\n\nThe `deletefromsource` command deletes files listed in a CSV file. It can also optionally destroy the files and export the operation results to a CSV file for auditing and reporting purposes.\n\nSYNTAX:\n\n    deletefromsource -filePath -destroy -csv -batch\n\nPARAMETERS:\n\n| Parameter | Type | Required | Description |\n|---|---|---|---|\n| `filePath` | string | Yes | Path to the source CSV file containing File IDs and Folder IDs. This can be outside the vault. |\n| `destroy` | flag | No | If specified, files will be permanently destroyed after deletion. |\n| `csv` | string | No | Path to export the results CSV file. |\n| `batch` | int | No | Destory batch size for large folders. |\n\nIMPORTANT NOTES ABOUT `-destroy`:\nThe `deletefromsource` command first attempts to delete and destroy (if `-destroy` used) files normally using the provided input (IDs from the CSV).\n\nAfter that initial pass, it performs a second step using the Name column. This is specifically for files that were already deleted but not destroyed.\nSince these files no longer exist in the vault in a normal state, they cannot be deleted again and their IDs do not exist anymore. Instead, PDMShell uses the file name to locate these previously deleted items and destroy them directly.\n\nThis approach allows you to:\n- Handle active files (delete → destroy)\n- Handle already deleted files (destroy only) if there a value in the name column. See structure of the CSV file.\n\nFor previously deleted files, you only need to provide the file name in the Name column.\n\nSOURCE CSV FORMAT:\n\nThe source CSV file must contain a header row with the following columns:\n\nFileID,FolderID,Name\n12345,678,1.sldprt\n12346,678,2.sldprt\n\nThe `Name` column is optional. PDMShell uses this value to destroy items. You can enter the names of files that were previously deleted; PDMShell will attempt to delete them (which will fail) and then proceed to destroy them. \n\n| Column | Description |\n|---|---|\n| FileID | The document ID of the file |\n| FolderID | The folder ID containing the file |\n\nRESULTS CSV FORMAT:\n\nIf `-csv` is specified, PDMShell will generate a results file containing:\n\nFileID,FolderID,Error\n12345,678,\"DELETE error: File Not Found\"\n\nRESULTS CSV COLUMNS:\n\n| Column | Description |\n|---|---|\n| FileID | File ID |\n| FolderID | Folder ID |\n| Error | Error message |\n\nREMARKS:\n\n- The source file **must be a CSV file with a header row**.\n\nEXAMPLES:\n\nDelete files from CSV:\ndeletefromsource -filePath \"files to delete.csv\"\n\n##Delete and destroy files:\ndeletefromsource -filePath \"files to delete.csv\" -destroy\n\nDelete, destroy, and export results:\ndeletefromsource -filePath \"files to delete.csv\" -destroy -csv \"results.csv\"\n\nDelete, destroy (50 files at a time in each folder), and export results:\ndeletefromsource -filePath \"files to delete.csv\" -destroy -csv \"results.csv\" -batch 50",
    "keywords": [
      "deletefromsource",
      "filepath",
      "destroy",
      "csv",
      "batch",
      "name"
    ],
    "category": "file-management"
  },
  {
    "id": "destroy",
    "title": "DESTROY Command",
    "content": "DESCRIPTION:\nThe `destroy` command is used to permanently delete files that have been marked as deleted in a specified directory. This command supports recursive deletion and filtering by date.\n\nSYNTAX:\n\ndestroy -directory -recursive -date \n\nPARAMETERS:\n\n- `directory`: The directory to destroy.\n- `recursive`: Enables recursive search (for files).\n- `date`: (Optional) Specifies a date filter. Only files deleted on or before the specified date will be destroyed. The date format should be YYYY-MM-DD.\n\nEXAMPLES:\n\ndestroy -directory \"C:\\Projects\\Project\"\n# destroys all deleted files in project folder\n\nREMARKS:\n\n- The `directory` parameter is mandatory and must specify a valid directory.\n- Use the `recursive` parameter with caution, as it will process all subdirectories within the specified directory.\n- The `date` parameter allows you to target files deleted on or before the specified date, providing more control over the destruction process.\n- This action is irreversible. Ensure you have the necessary permissions and have reviewed the files before executing the command.\n\nTUTORIAL:\n<video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/destroy.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>",
    "keywords": [
      "destroy",
      "directory",
      "recursive",
      "date"
    ],
    "category": "file-management"
  },
  {
    "id": "dir",
    "title": "DIR Command",
    "content": "DESCRIPTION:\nDisplays a list of files and subdirectories in a directory.\n\nSYNTAX:\n\ndir -sort -columns -csv -refresh\n\nPARAMETERS:\n\n-`sort`: The column name to sort the list of files and folders with.\n\n-`columns`: The columns to display, separated by commas. These are PDM variables drawn from the @ tab.\n\n-`csv`: Export the directory listing to a CSV file. Must include the csv extension\n\n-`refresh`: Refreshes the session to load the current files and sub-folders in the active directory in the autocomplete list.\n\n-`recursive`: Lists all files and all folders in the current directory recursively. \n\nEXAMPLES:\n\ndir  #\"C:\\Vault\\Documents\"\ndir  -sort \"name\" -cols \"description,partnumber\" -csv \"output.csv\" -refresh\n\nREMARKS:\n\n- Use the `-refresh` parameter to force the session to load the current files and sub-folders in the active directory. Do not use this when the current folder has many items.\n- The CSV file will be checked into the current directory.\n\nTUTORIAL:\n <video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/dir.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>",
    "keywords": [
      "dir",
      "sort",
      "columns",
      "csv",
      "refresh",
      "recursive"
    ],
    "category": "navigation"
  },
  {
    "id": "dispatch",
    "title": "Notes About Running PDMShell Scripts from Dispatch",
    "content": "When you want to run PDMShell scripts from Dispatch, you can use the **Shell Command** action.\n\nShell Command Settings\n\n![dispatchwindow](../images/dispatchwindow.png)\n\n1. **Verb**: Leave this field empty.\n2. **Filename**: Specify the path to the PDMShell executable, which is `pdmcli.exe`.  \n > Do not wrap the path in quotes (`\"\"`), even if it contains spaces.\n\n3. **Parameters**: Use the following format:  \n   ```bash\n   runscript \"pathToScript\" [additional parameters]\n   ```\n\n- The pathToScript must be wrapped in quotes (\"\") if it contains spaces.\n- Additional parameters can be passed to the script as needed.\n\nExample: Dispatch Shell Execute Configuration\n\nVerb: #leave this empty\nFilename: C:\\Program Files (x86)\\BLUE BYTE SYSTEMS INC\\PDMShell\\PDMCLI.exe\nParameters: runscript \"C:\\Scripts\\frogleap.pdmshell\" \"%PathToSelectedFile%\" \"%OldVersion%\"\n\nExample Script:\n\nIn the PDMShell script (frogleap.pdmshell), you can reference the parameters as follows:\n\n``` bash\n# check selected file out\ncheckout -filePath \"$parameter1$\"\n# frogleap version to specified version \nfrogleap -filePath \"$parameter1$\" -oldVersion \"$parameter2$\"\n# save changes\ncheckin -filePath \"$parameter1$\" -comment \"prompted version $parameter2$\"\n# you must call this\nquit\n\nTutorial\n <video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/dispatch.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>\n\nTips for Running PDMShell Scripts from Dispatch\n- Test Your Scripts: Always test your PDMShell scripts independently before integrating them with Dispatch.\n- Use Quotes for Paths: Wrap paths and parameters in quotes (\"\") if they contain spaces to avoid errors.",
    "keywords": [
      "dispatch",
      "notes",
      "about",
      "running",
      "pdmshell",
      "scripts"
    ],
    "category": "scripting"
  },
  {
    "id": "docmanprops",
    "title": "DOCMANPROPS Command",
    "content": "DESCRIPTION\n\nThe `docmanprops` command is used to **export and update SOLIDWORKS file custom properties** without opening SOLIDWORKS.\n\nThis command supports two primary modes:\n\n- **Export Mode (Default)** — Reads properties from SOLIDWORKS files and writes them to a CSV file\n- **Update Mode** — Reads a CSV file and writes the properties back into the SOLIDWORKS files (Same CSV from Export mode)\n\n- **Refresh Mode** — Reads a CSV file and refreshes the content of the csv.\n\n?This command works with the file system and requires files to be locally cached. It reads and writes files both inside and outside the vault. Relative paths only work in the vault directory (and requires you to be logged in).\n---\n\n# SYNTAX\n\ndocmanprops -directory <path> -csv <csvPath> [-recursive] [-configNames] [-update] [-refresh][extensions]\n\n---\n\n# PARAMETERS\n\ndirectory\n\nSpecifies the folder containing SOLIDWORKS files.\n\nExample:\n```bash \n`-directory \"C:\\Vault\\Projects\"`\n\n---\n\ncsv\n\nSpecifies the CSV file path.\n\nUsed for:\n\n- Export destination\n- update source\n\nExample: `-csv \"C:\\temp\\props.csv\"`\n\n---\n\nupdate\n\nWhen specified, the command runs in **Update Mode**.\n\nReads the CSV file and writes the properties back into the SOLIDWORKS files.\n\n---\nrefresh\n\nWhen specified, the command runs in **Refresh Mode**.\n\nReads the CSV file and refreshes the content of the properties in the csv file.\n\n---\nrecursive\n\nWhen specified, searches subfolders.\n---\n\nconfigNames\n\nSpecifies which configurations to include.\n\nDefault: All configurations\n\nExample: `-configNames \"Default,Config1\"` Use space for custom property.\n\n---\n\nextensions\n\nSpecifies which file extensions to include when exporting or updateing properties.\n\nDefault: `*` (all files)\n\nSupports wildcards and multiple values separated by commas.\n\nSpecial value for all solidworks file extensions is: `solidworks`\n\nExamples:\n\n#all solidworks files\n-extensions \"solidworks\"\n\n-extensions \"*.sld*\"\n\n-extensions \"*.sldprt,*.sldasm\"\n\n-extensions \"*.sld*,*.pdf\"\n\n-extensions \"*\"\n\nIf an extension filter contains spaces, wrap it in quotes.\n\nExample:\n\n-extensions \"*.sld*,*.step,*.pdf\"\n\nUse `*.*` to include all files regardless of extension.\n--\n\n# CSV FORMAT\n\nThe CSV contains the following columns:\n\nFolder  \nFullPath  \nFileName  \nExtension  \nConfiguration  \nProperty  \nValue  \nEvaluatedValue  \nType  \nSuccess  \nException  \n\nExample:\n\nC:\\Vault\\Part, C:\\Vault\\Part\\Part1.SLDPRT, Part1, .SLDPRT, Default, Description, Plate, Plate, Text, True,\n\n---\n\n# EXPORT MODE\n\nDESCRIPTION\n\nReads properties from files and writes them to CSV.\n\nProperties include:\n\n- File custom properties\n- Configuration properties\n- Evaluated values\n- Property types\n\n---\n\nEXAMPLE\n\ndocmanprops -directory \"C:\\Vault\\Parts\" -csv \"C:\\temp\\props.csv\" -recursive\n\nOUTPUT\n![export mode](/images/exportmode.png)\n---\n\n# update MODE\n\nDESCRIPTION\n\nReads CSV file and writes properties back into files.\n\nFeatures:\n\n- Opens each file once\n- Updates all properties\n- Saves file\n- Updates CSV Success and Exception columns\n- Parallel processing\n\nImplementation reference: :contentReference[oaicite:1]{index=1}\n\n---\n\nEXAMPLE\n\ndocmanprops -csv \"C:\\temp\\props.csv\" -update\n\nOUTPUT\n![updatemode](/images/refreshmode.png)\n\nTemporary files start with ~ are ignored.\n---\n\n# SUCCESS AND ERROR TRACKING\n\nThe CSV is updated during update:\n\nSuccess column:\n\nTrue — Property updated successfully  \nFalse — Property update failed  \n\nException column:\n\nContains error message\n\nExample:\n\nProperty,Success,Exception\nDescription,True,\nPartNumber,False,Configuration Default not found\n\n---\n\n# PERFORMANCE\n\nTypical performance:\n\n| Files | Time |\n|---|---|\n| 1,000 | seconds |\n| 10,000 | under 1 minute |\n| 100,000 | few minutes |\n\n---",
    "keywords": [
      "docmanprops"
    ],
    "category": "general"
  },
  {
    "id": "dump",
    "title": "DUMP Command",
    "content": "DESCRIPTION:\nDumps all session text into a log file and check it back into the vault.\n\nSYNTAX:\n\ndump filePath\n\nPARAMETERS:\n\n- `filePath`: The log file to dump session details into.\n\nEXAMPLES:\n\ndump -filePath \"$release_script_$yyyy_$mm_$dd_$guid.txt\"\n\nREMARKS:\n\n- To make sure your logs are always unique, use `$guid` or the date/time place holders. You can get more information about these place holders [here](/src/EVAL.html).\n\n- If you start PDMShell as a Windows administrator with the `-winlog` or `/winlog` parameter, PDMShell will create logs in the Windows event viewer.",
    "keywords": [
      "dump",
      "filepath"
    ],
    "category": "system"
  },
  {
    "id": "editvars",
    "title": "EDITVARS Command",
    "content": "DESCRIPTION:\nOpens the PDM variable editor.\n\nSYNTAX:\n```bash \neditvars\n\nPARAMETERS:\nNone\n\nEXAMPLES:\n\neditvars\n# open the PDM variable editor \n\nTUTORIAL:\n![Variable Editor Manager](../images/editvars.png)",
    "keywords": [
      "editvars"
    ],
    "category": "variables"
  },
  {
    "id": "escapingquotes",
    "title": "This runs the command: help -command \"checkout\" (See above)",
    "content": "### When calling from **command line (cmd.exe or Dispatch):**\n---\n#### Example 1:\n![escapequotescommandline](../images/escapequotecommandline.png)\n\nUsing `\\\"` in `cmd.exe` will actually produce \" in the PDMShell session:\n\npdmcli.exe /single help -command \\\"checkout\\\" \n\n#### Example 2:\n\nUsing `\\\\\\\"\"` in `cmd.exe` will actually produce `\\\"` in the PDMShell session command box which in turn gets evaluated as `\"` once executed:\n\n![escapequotescommandline](../images/escapequotecommandline_1.png)\n\npdmcli.exe /single setvar -filePath membrane.sldprt -variableName Description -value \\\" 1 \\\\\\\"\" 3\\\"\n\nwill produce:\n\n# >setvar -filePath membrane.sldprt -variableName Description -value \"1 \\\" 3\"\n# >@: Set Description to 1 \" 3\n# \\\" in PDMShell session evaluates to \"\n\n### When calling from **PDMShell regular session:**\n---\nTo escape `\"`, use this `\\\"`:\n\nsetvar -filePath membrane.sldprt -VariableName Description -value \"3/1\"\n# @: Set Description to 3/1\nsetvar -filePath membrane.sldprt -VariableName Description -value \"3/\\\"1\"\n# @: Set Description to 3/\"1\n# \\\" escape \" in a regular session",
    "keywords": [
      "escapingquotes",
      "this",
      "runs",
      "help",
      "checkout",
      "see",
      "above"
    ],
    "category": "scripting"
  },
  {
    "id": "eula",
    "title": "End User License Agreement",
    "content": "1. Introduction\n\nThis End User License Agreement (**\"EULA\"**) is a legal agreement between you (**\"Licensee\"**) and **Blue Byte Systems Inc. (\"Licensor\")**, governing your use of the **PDMShell** software product and any associated documentation (collectively, the **\"Software\"**). By installing, copying, automating (including automatic or unattended use), or otherwise using the Software, you agree to be bound by the terms of this EULA. If you do not agree, do not install, copy, automate, or otherwise use the Software.\n\n2. License Grant\n\nLicensor grants Licensee a non-exclusive, non-transferable, non-sublicensable, limited right to use the Software on a single computer or device for Licensee’s own internal business purposes.\n\n**Special Licensing Requirement:**  \nData migration companies, SOLIDWORKS resellers, or third-party providers utilizing or incorporating PDMShell into their commercial services or products **must** purchase a special licensing model from Blue Byte Systems Inc. Use without acquiring such licensing is strictly prohibited.\n\n3. Restrictions\n\nLicensee agrees not to, and shall not permit others to:\n\n- Resell, distribute, or sublicense the Software to any third party.\n- Modify, adapt, translate, or create derivative works of the Software.\n- Reverse engineer, decompile, disassemble, or otherwise attempt to derive the source code of the Software.\n- Rent, lease, lend, or otherwise transfer the Software to any third party.\n- Use the Software for any illegal purpose or in violation of applicable law.\n\nTo improve our software and validate licenses, the Software may collect certain metadata about the machine it is installed on, including but not limited to the IP address, SOLIDWORKS version, and operating system version. This information is used solely for the purposes of enhancing the Software and ensuring compliance with licensing terms. By using the Software, you consent to this data collection.\n\n5. Intellectual Property\n\nThe Software and all related intellectual property rights, including copyrights, patents, trademarks, and trade secrets, are owned by Licensor or its licensors. This EULA does not grant Licensee any ownership rights in the Software.\n\n6. Termination\n\nThis EULA shall automatically terminate upon Licensee’s breach of any of its terms. Licensor may also terminate this EULA at any time upon written notice to Licensee. Upon termination, Licensee shall cease all use of the Software and delete all copies of the Software from its systems.\n\n7. Disclaimer of Warranty\n\nTHE SOFTWARE IS PROVIDED **\"AS IS\"** WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. LICENSOR DOES NOT WARRANT THAT THE SOFTWARE WILL BE ERROR-FREE OR THAT IT WILL MEET LICENSEE’S REQUIREMENTS.\n\n8. Limitation of Liability\n\nIN NO EVENT SHALL LICENSOR BE LIABLE FOR ANY DAMAGES WHATSOEVER, INCLUDING WITHOUT LIMITATION, DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, ARISING OUT OF THE USE OF OR INABILITY TO USE THE SOFTWARE, EVEN IF LICENSOR HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.\n\n9. Changes to Terms\n\nLicensor reserves the right, in its sole discretion, to modify or update this EULA at any time **without prior notice**. Continued use of the Software constitutes acceptance of the modified or updated terms.\n\n10. Governing Law\n\nThis EULA shall be governed by and construed in accordance with the laws of British Columbia, Canada, without regard to its conflict of law provisions.\n\n11. Entire Agreement\n\nThis EULA constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior or contemporaneous communications, representations, and agreements, whether oral or written.\n\n12. Severability\n\nIf any provision of this EULA is held to be invalid or unenforceable, such provision shall be struck, and the remaining provisions shall remain in full force and effect.\n\n13. Contact Information\n\nFor any questions regarding this EULA, please contact:\n\n**Blue Byte Systems Inc.**  \nEmail: [amen@bluebyte.biz](mailto:amen@bluebyte.biz)",
    "keywords": [
      "eula",
      "end",
      "user",
      "license",
      "agreement"
    ],
    "category": "general"
  },
  {
    "id": "eval",
    "title": "Dynamic Placeholders in PDMShell",
    "content": "Overview\n\nThe **Dynamic Placeholders** feature in PDMShell allows you to substitute values dynamically using placeholders. This functionality is supported by several commands and enables the use of file or folder properties, system variables, and other contextual information to generate new values automatically.\n\nDynamic Placeholders are not a standalone command but a **feature** used by specific commands to process the `value` parameter or other relevant inputs.\n\n---\n\nCommands Supporting Dynamic Placeholders\nThe following commands support the use of dynamic placeholders:\n\n### Commands Using the Current Folder as the Backing Object (`directory` parameter):\n- **`cd`**: Change the current directory.\n- **`mkdir`**: Create a new directory.\n- **`export`**: Export commands to a file.\n- **`addtvault`**: Add a vault with the directory as the backing object.\n\n### Commands Using Files or Folders as the Backing Object:\n- **`rename`**: Uses the `value` parameter for renaming files or folders.\n- **`renamefromsource`**: The new file is evaluated if the `evaluatealiases` parameter is specified.\n- **`setvar`**: Uses the `value` parameter to set variables for files or folders.\n- **`bom`**: Uses the `name` parameter to set the exported bom csv name.\n- **`export`**: Uses the `name` parameter to set the exported files name pattern.\n\n---\n\nPlaceholders for Dynamic Substitution\nThe `value` parameter in supported commands can include placeholders that are dynamically replaced with actual values based on the context. The placeholders differ slightly depending on whether the backing object is a **file** or a **folder**.\n\n### Placeholders for Files\n- `$value`: Existing value of the variable.\n- `$name`: The file name with extension.\n- `$namewithoutextension`: The file name without extension.\n- `$extension`: The file extension.\n- `$id`: The file ID.\n- `$revision`: The current revision of the file (PDM revision, not the PDM variable).\n- `$version`: The current version of the file.\n- `$fullyqualifiedname`: The full local path of the file.\n- `$fullyqualifiedfoldername`: The full local path of the folder containing the file.\n- `$foldername`: The name of the folder containing the file.\n- `$configuration`: configuration name. Only valid for BOM command.\n\n### Placeholders for Folders\n- `$value`: Existing value of the variable.\n- `$name`: The folder name.\n- `$foldername`: The name of the parent folder.\n- `$id`: The folder ID.\n- `$fullyqualifiedname`: The full local path of the folder.\n\n### Common Placeholders (Applicable to Both Files and Folders)\n- `$username`: The name of the logged-in user.\n- `$vaultname`: The name of the vault.\n- `$yyyy`: The current year.\n- `$mm`: The current month (two digits).\n- `$hh`: The current hour (two digits).\n- `$mi`: The current minute (two digits).\n- `$ss`: The current second (two digits).\n- `$date`: The current date.\n- `$time`: The current time in the current locale.\n- `$guid`: Unique identifier.\n---\n\nUsing Variables in Dynamic Placeholders\nIn addition to placeholders, you can include other variables by enclosing them in square brackets (e.g., `[VariableName]`). These variables are dynamically resolved based on the context of the file or folder.\n\n---\n\nExample Usage\nHere’s an example of how to use dynamic placeholders in a command:\n\n### Renaming a File\n\nrename -filePath 1.sldprt -value \"$nameWithoutExtension_$yyyy$mm$dd$extension\"",
    "keywords": [
      "eval",
      "dynamic",
      "placeholders",
      "pdmshell"
    ],
    "category": "scripting"
  },
  {
    "id": "export",
    "title": "EXPORT Command",
    "content": "DESCRIPTION:\n\nThe `ExportCommand` allows you to export SOLIDWORKS files from the PDM vault to various formats using SOLIDWORKS. This command supports exporting a single file or multiple files found via search, with options for specifying file extensions, export location, and more.\n\nSYNTAX:\n\nexport [-search|-filePath] -name -directory -extensions -recursive -version\n\nPARAMETERS:\n\nThe export command requires several parameters:\n\n- `filePath`: Path to the file to export (relative or absolute).\n- `name`: The base name for the exported file(s). This supports evaluation. More [information here](/src/EVAL.html).\n- `directory`: The target folder for exported files.\n- `extensions`: Comma-separated list of file extensions to export to (e.g., `pdf,dxf`).\n- `search`: Search query to find files for export.\n- `recursive`: If set, search will include subfolders.\n- `timeout`: timeout in seconds (for starting SOLIDWORKS only)\n- `version`: SOLIDWORKS year version. Example 2023. Default is latest.\n\nEXAMPLE:\n\nExport a file to PDF and DXF in a specific directory using SOLIDWORKS 2023:\n\nexport -filePath\"Designs/part1.sldprt\" -name \"part1_export\" -directory \"Exports\" -extensions \"pdf,dxf\" -version 2023",
    "keywords": [
      "export",
      "filepath",
      "name",
      "directory",
      "extensions",
      "search",
      "recursive",
      "timeout",
      "version"
    ],
    "category": "export"
  },
  {
    "id": "faq",
    "title": "Frequently Asked Questions (FAQ) for PDMShell",
    "content": "---\n\n1. What is PDMShell?\nPDMShell is a command-line environment for **SOLIDWORKS PDM Professional** that allows users to automate, query, and batch process vault data using simple shell commands.  \nIt is designed for administrators, developers, and power users who want to extend PDM capabilities beyond the standard client.\n\n---\n\n2. What is the difference between the Free and Premium versions?\n\n| Feature | **Free License** | **Premium License** |\n|----------|------------------|---------------------|\n| Max items processed per command | **5 items** | **Unlimited** |\n| Access to all `search` commands | ✅ Included | ✅ Included |\n| Workflow and transition integration | ❌ Not available | ✅ Available |\n| Technical support & updates | ❌ Not available | Priority |\n| Commercial use | ❌ Not available | ✅ Allowed |\n\nThe **Free License** is ideal for evaluation and lightweight tasks.  \nThe **Premium License** unlocks full automation, workflow integration, and unlimited command processing.\n\n---\n\n3. How do I install or update PDMShell?\nYou can install or update PDMShell from:\n- The [official website](https://pdmshell.bluebyte.biz), or  \n- The **Microsoft Store**\n\nFor detailed setup steps, see the [Installation Guide](howtoinstall.md).  \nIf you are updating from a previous version, uninstall the old one first to ensure all command definitions and descriptions are refreshed properly.\n\n---\n\n4. Why are some commands marked as “N/A” or missing descriptions after an update?\nThis usually happens when PDMShell is updated over an existing installation without removing old files.\n\n### Solution:\n1. Uninstall the current version of PDMShell.  \n2. Download the latest version from the [official website](https://pdmshell.bluebyte.biz).  \n3. Reinstall it cleanly to refresh command data and documentation.\n\n---\n\n5. Do I need administrative privileges to install PDMShell?\nYes. Administrative privileges are required when installing PDMShell from the website installer (MSI).  \nIf you install via the Microsoft Store, Windows handles elevation automatically.\n\n---\n\n6. What are the system requirements for PDMShell?\n- **Operating System:** Windows 10 or 11  \n- **SOLIDWORKS PDM Professional:** 2014 or newer  \n- **SOLIDWORKS 3D:** 2017 or newer (for commands that interact with SOLIDWORKS)\n\n---\n\n7. How do I report a bug or request support?\nYou can reach us via:\n- **Email:** [support@bluebyte.biz](mailto:support@bluebyte.biz)  \n- **Web Form:** [bluebyte.biz/contact](https://bluebyte.biz/contact)\n\nPlease include your PDMShell version, command name, and error message when reporting issues.\n\n---\n\n8. Which commands are available in the Free version?\nAll **search-related commands** and basic file utilities are free to use (limited to processing **5 items per run**).  \n\nThese commands are ideal for quick lookups, validation, and testing automation workflows before upgrading to Premium.\n\n---\n\nFor additional questions, contact us anytime at [support@bluebyte.biz](mailto:support@bluebyte.biz).",
    "keywords": [
      "faq",
      "frequently",
      "asked",
      "questions",
      "pdmshell"
    ],
    "category": "general"
  },
  {
    "id": "freevspremium",
    "title": "PDMShell Free vs Premium",
    "content": "PDMShell comes in two editions: **Free** for light use and **Premium** for full automation in SOLIDWORKS PDM.\n\n---\n\nOVERVIEW\n\n| Edition | Description |\n|----------|--------------|\n| **Free** | Ideal for testing and small jobs. Processes up to **5 items per command**. |\n| **Premium** | Full access with **unlimited processing**, workflow automation, and scripting. |\n\n---\n\nFEATURE COMPARISON\n\n| Feature | Free | Premium |\n|----------|------|----------|\n| Max items per command | 5 | Unlimited |\n| All `search` commands | ✅ | ✅ |\n| `printfromsource`, `getvar` | ✅ (5-limit) | ✅ Unlimited |\n| Workflow & transitions | ❌ | ✅ |\n| Automation scripting | ❌ | ✅ |\n| Alias & renaming | ✅ | ✅ |\n| Priority support | ❌ | Full |\n| Commercial use | ✅ (non-resellers) | ✅ |\n| Reseller use | ❌ | ✅ |\n| Cost | Free | Paid |\n\n---\n\nFREE EDITION\n\nPerfect for evaluation, quick lookups, and validation tasks.  \n**Limit:** 5 items per command.  \n**Note:** Resellers and VARs may not use the Free version commercially.\n\n**Example:**\n\nprintfromsource -filePath \"source.csv\" -csv \"output.csv\"\n\nBUY PREMIUM\n\nTo buy a Premium PDMShell license, visit:\nhttp://bluebyte.biz/product/pdmshell",
    "keywords": [
      "freevspremium",
      "pdmshell",
      "free",
      "premium"
    ],
    "category": "general"
  },
  {
    "id": "frogleap",
    "title": "FROGLEAP Command",
    "content": "DESCRIPTION:\nFrog leaps an old version as newest. \n\nSYNTAX:\n\nfrogleap -search -filePath -oldVersion\n\nPARAMETERS:\n- `search`: The search operation to use.\n- `filePath`: The file(s) to be frog leaped. This is the default parameter.\n- `oldVersion:` The old version to leap. This is an integer.\n\nEXAMPLES:\n``` bash\nfrogleap -filePath \"file1.sldprt\" -oldVersion 2\n\nREMARKS:\n- The `search` parameter searches the current directory and does not drill down. The search query is a PDM one, so you can use `%` for wildcard.\n\nTUTORIAL:\n <video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/frogleap.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>",
    "keywords": [
      "frogleap",
      "search",
      "filepath"
    ],
    "category": "version-control"
  },
  {
    "id": "get",
    "title": "GET Command",
    "content": "DESCRIPTION:\nRetrieves a specified version of a file or files (via search).\n\nSYNTAX:\n\nget -search -filePath -version\n\nPARAMETERS:\n- `search`: The search operation to use.\n\n- `filePath`: The file(s) to retrieve. This is the default parameter.\n\n-`version`:  (Optional) The version of the file to retrieve\n\n-`directory`: (Optional) Folder where to deposit the file. Can be outside vault. Do not end with \\\\. If not specified, file is cached in its folder. \n\n-`getoptions`: (Optional). Allows you to cache references as well:\n\n| Option Name (CLI)        | Description |\n|--------------------------|-------------|\n| Simple                   | Retrieves the file with no additional options applied. |\n| MakeReadOnly             | Marks the retrieved file as read-only in the local cache. |\n| DisableRefresh           | Does not refresh File Explorer after the file is retrieved. |\n| RefsOnlyMissing          | Retrieves only referenced files that are not already present on the local hard disk. |\n| RefsVerLatest            | Retrieves the latest versions of referenced files that the user has permission to see, instead of the attached (as-built) versions used when the file was checked in. |\n| RefsOverwriteLocked      | Retrieves referenced files even if they are checked out and overwrites local changes; **warning:** any previous modifications to checked-out files will be lost. |\n| ForPreview               | Retrieves only referenced files required for SOLIDWORKS PDM preview when retrieving the referencing file. |\n\nEXAMPLES:\n\nget -filePath \"file1.sldprt\" -Version 2\n\nREMARKS:\n- The `search` parameter searches the current directory and does not drill down. The search query is a PDM one, so you can use `%` for wildcard.",
    "keywords": [
      "get",
      "search",
      "filepath",
      "version",
      "directory",
      "getoptions"
    ],
    "category": "version-control"
  },
  {
    "id": "getvar",
    "title": "GETVAR Command",
    "content": "DESCRIPTION:\nGets the value of a variable for a specified file or folder.\n\nSYNTAX:\n\ngetvar -filePath -variableName -configs -clear -version\n\nPARAMETERS:\n- `filePath` :  \n  The file or folder to get the variable from.\n\n- `variableName` :  \n  The variable name to retrieve.\n\n- `configs` :  \n  The configuration names to retrieve the variable from, separated by commas.\n\n- `clear` :  \n  Clears the variable value.\n\n- `version` :  \n  The version of the file to retrieve the variable from.\n\nEXAMPLES:\n\ngetvar -filePath \"file1.sldprt\" -variableName \"CustomVar\"\n\nREMARKS:\n- The configuration names should be separated by commas.\n- The variable must be in the data card.\n- **This comand will return what's in the locale cache which may not be necessarily the latest version. For that, please use `getVarFromDB`**.",
    "keywords": [
      "getvar",
      "filepath",
      "variablename",
      "configs",
      "clear",
      "version"
    ],
    "category": "variables"
  },
  {
    "id": "getvarfromdb",
    "title": "GETVARFROMDB Command",
    "content": "DESCRIPTION:\nGets the value of a variable for a specified file or folder directly from the database.\n\nSYNTAX:\n\ngetvarfromdb -filePath -variableName -configs\n\nPARAMETERS:\n- `filePath` :  \n  The file or folder to get the variable from.\n\n- `variableName` :  \n  The variable name to retrieve from the database.\n\n- `configs` :  \n  The configuration names to retrieve the variable from, separated by commas.\n\nEXAMPLES:\ngetvarfromdb -f \"file1.sldprt\" -variableName \"CustomVar\"\n\nREMARKS:\n- The configuration names should be separated by commas.\n- This command will always return the latest value.",
    "keywords": [
      "getvarfromdb",
      "filepath",
      "variablename",
      "configs"
    ],
    "category": "variables"
  },
  {
    "id": "help",
    "title": "HELP Command",
    "content": "DESCRIPTION:\nProvides help about a command.\n\nSYNTAX:\n\nhelp [-command|-c]\n\nPARAMETERS:\n-`command`: The specific command you need help with.\n\nEXAMPLES:\n\nhelp -c cd #opens the help page about the change directory command",
    "keywords": [
      "help",
      "command"
    ],
    "category": "system"
  },
  {
    "id": "history",
    "title": "HISTORY Command",
    "content": "DESCRIPTION:\nPrints the history of a file.\n\nSYNTAX:\n\nhistory [-search|-filePath] \n\nPARAMETERS:\n- `search`:  The search operation to use.\n\n- `filePath`: The file to get the history for.\n\nEXAMPLES:\n\nhistory -f \"file1.sldprt\"\n# lists the history of file1\n\nREMARKS:\n- The search parameter searches the current directory and does not drill down. The search query is a PDM one, so you can use `%` for wildcard.\n\nPREVIEW:\n![History Command](../images/history.png)",
    "keywords": [
      "history",
      "search",
      "filepath"
    ],
    "category": "version-control"
  },
  {
    "id": "howtoinstall",
    "title": "How to Install/Update PDMShell",
    "content": "PDMShell can be installed or updated from our official website or via the Microsoft Store. For the best experience, we **highly recommend downloading PDMShell from our official website** to ensure you always have the latest version.\n\nThe Microsoft Store does not automatically update PDMShell. If you installed PDMShell via the Microsoft Store, you may need to uninstall it and reinstall the latest version manually.\n\n---\n\nInstallation Methods\n\n### 1. From Our Website (Recommended)\n- Visit our official website to download the latest version of PDMShell:  \n<div align=\"center\">\n  <a href=\"https://bluebyte.biz/wp-json/slm_custom/downloadpdmshell\" class=\"download-button\">⬇️ DOWNLOAD PDMShell LATEST VERSION</a>\n</div>\n\n- If **Safe Browsing** is turned off in your browser (e.g., Chrome), the installer might be flagged as unverified. Simply click on **Download Anyway** or **Keep** to proceed with the download.\n\n![Safe Browsing Warning](/images/image.png)\n\n- After downloading, double-click the installer and follow the on-screen instructions to complete the installation.  \n  > **Note**: You may need administrative privileges to install PDMShell.\n\n---\n\n### 2. From the Microsoft Store\n1. Open the **Microsoft Store** on your Windows device.\n2. Search for **PDMShell** in the search bar.\n3. Select the PDMShell app from the search results.\n4. Click **Get** or **Install** to begin the installation process.\n5. Wait for the installation to complete, and then launch PDMShell from the Start menu.\n\n---\n\nNotes\n- **Administrative Privileges**: Depending on your system settings, you may need admin privileges to install PDMShell, especially if installing from the official website.\n- **Updates**: The website always contains the latest version of PDMShell. If you installed PDMShell via the Microsoft Store, you may need to manually uninstall and reinstall to get the latest updates.\n\nCommon Update Issues\n\nSometimes after updating, new commands might show up as `N/A` in the help command. In such case, please uninstall PDMShell and reinstall it to reload the latest resources.  \n\n![updateissue](../images/updateissue.png)\n\n---\n\nSystem Requirements\nTo ensure PDMShell runs smoothly, your system must meet the following requirements:\n- **Operating System**: Windows 10/11\n- **SOLIDWORKS PDM Professional**: Version 2014 or newer\n- **SOLIDWORKS 3D**: Version 2017 or newer (for commands that use SOLIDWORKS)\n\n---\n\nSupport\nFor further assistance, visit our [Support Page](https://bluebyte.biz/contact) or contact us at `amen@bluebyte.biz`.",
    "keywords": [
      "howtoinstall",
      "how",
      "install",
      "update",
      "pdmshell"
    ],
    "category": "general"
  },
  {
    "id": "inbox",
    "title": "INBOX Command",
    "content": "DESCRIPTION:\nOpens the PDM inbox or sends a message as the logged-in user.\n\nSYNTAX:\n\ninbox -filePath -name -value\n\nPARAMETERS:\n-`name`: Name of the user to send the message to. \n-`value`: Message: supports evaluation against the `filePath`.\n-`filePath`: Associated file\n\nEXAMPLES:\n\ninbox -message 'File checked in successfully'\n# sends the specified message to the logged-in user",
    "keywords": [
      "inbox",
      "name",
      "value",
      "filepath"
    ],
    "category": "system"
  },
  {
    "id": "index",
    "title": "PDMShell",
    "content": "<style>\n  body {\n    background-color: #121212;\n    color: #e0e0e0;\n    font-family: Arial, sans-serif;\n  }git \n  h2 {\n    color: #bb86fc;\n  }\n  p {\n    color: #e0e0e0;\n  }\n  a {\n    color: #bb86fc;\n    text-decoration: none;\n  }\n  a:hover {\n    text-decoration: underline;\n  }\n  .container {\n    display: flex;\n    flex-wrap: wrap;\n    justify-content: center;\n    margin: 20px 0;\n  }\n    \n  .card {\n    background-color: #1f1f1f;\n    border: 1px solid #333;\n    border-radius: 8px;\n    margin: 10px;\n    padding: 20px;\n    width: 300px;\n    text-align: center;\n  }\n  .card img {\n    max-width: 100%;\n    height: auto;\n    border-radius: 8px;\n  }\n  .video-container {\n    background-color: black;\n    width: 100%;\n padding: 10px;\n      margin: auto;\n    text-align: center;\n  }\n  .video-container video {\n    width: 100%;\n    max-width: 800px;\n    height: auto;\n    border-radius: 8px;\n  }\n  .download-button {\n    display: inline-block;\n    background-color: #bb86fc;\n    color: #ffffff;\n    font-weight: bold;\n    text-transform: uppercase;\n    padding: 10px 20px;\n    border-radius: 8px;\n    margin: 20px 0;\n    text-align: center;\n  }\n  .download-button:hover {\n    background-color: #9b6fcf;\n  }\n\n body {\n      background-color: #1a1a1a;\n      margin: 0;\n      font-family: 'Open Sans', sans-serif;\n    }\n\n    .header-container {\n      display: flex;\n      padding: 10px;\n      margin: auto;\n      align-items: center;\n      gap: 20px;\n      flex-wrap: wrap;\n    }\n\n    .header-text {\n      color: white;\n      text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);\n      font-weight: 600;\n      font-size: 32px;\n      margin: auto;\n      text-transform: uppercase;\n      letter-spacing: 1px;\n      line-height: 1.4;\n      max-width: 600px;\n    }\n\n  \n\n    @media (max-width: 768px) {\n      .header-container {\n        flex-direction: column;\n        align-items: flex-start;\n      }\n\n    \n    }\n\n</style>\n\n<div class=\"video-container\">\n<div class=\"header-container\">\n   \n    <div class=\"header-text\">\n      Best Commandline for <br>\n      SOLIDWORKS PDM Professional. \n    </div>\n    </div>\n <iframe width=\"850\" height=\"500\" src=\"https://www.youtube.com/embed/UgNCkIuo-CM?si=h3U4PrZX-ES0bC8T\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>\n    \n  </video>\n<p style=\"color: #bbbbbb; margin:auto; font-family:  'Open Sans', sans-serif;\">\n  A 29-min walkthrough of PDMShell covering the most commonly used commands\n</p>\n</div>\n\n</div>\n<br>\n\n**PDMShell**, a command-line interpreter designed to streamline and automate tasks within **SOLIDWORKS PDM Professional**. We also provide helpful articles on PDM best practices and tooling. Before submitting a support ticket, we highly recommend reviewing the documentation and troubleshooting guides available on this site. Click on PDM Commands to get [started](../src/introduction.html).\n\n<br>\n\n<div align=\"center\">\n  <a href=\"https://bluebyte.biz/wp-json/slm_custom/downloadpdmshell\" class=\"download-button\">DOWNLOAD PDMSHELL DIRECTLY</a>\n</div>\n\n<br>\n<!-- \n<div style=\"text-align: center;\">\n  <h2 style=\"color: #bb86fc; margin-bottom: 10px;\">PDMShell is free to download and use*.</h2>\n  <p style=\"color: #e0e0e0; font-family: Arial, sans-serif; margin: 0 auto; max-width: 800px;\">\n    PDMShell is free to use and allows you to test all commands with some limits without committing to a license. To buy a license, please visit the \n    <a href=\"https://bluebyte.biz/product/pdmshell\" style=\"color: #bb86fc; text-decoration: none;\">Blue Byte Systems online shop</a>. Read details below.\n  </p>\n</div>\n\n<br>\n\n \n<div class=\"container\" style=\"flex-direction: column; align-items: center;\">\n  <div class=\"card\" style=\"width: 100%; max-width: 800px; background-color: #000000; border-radius: 12px; padding: 20px; margin: 10px;\">\n    <h2 style=\"color: #ffffff;\">Find Any File Archive Path</h2>\n    <p style=\"color: #bbbbbb;\">Learn how to manage archive paths effectively in PDMShell.</p>\n    <video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/archive path.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>\n  </div>\n \n  <div class=\"card\" style=\"width: 100%; max-width: 800px; background-color: #000000; border-radius: 12px; padding: 20px; margin: 10px;\">\n    <h2 style=\"color: #ffffff;\">Edit Datacards like a Boss</h2>\n    <p style=\"color: #bbbbbb;\">Change datacard values for one of many files using the SetVar command.</p>\n    <video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/setvar.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>\n  </div>\n\n  <div class=\"card\" style=\"width: 100%; max-width: 800px; background-color: #000000; border-radius: 12px; padding: 20px; margin: 10px;\">\n    <h2 style=\"color: #ffffff;\">Change Directory</h2>\n    <p style=\"color: #bbbbbb;\">Understand how to use the CD command to navigate directories in PDMShell.</p>\n    <video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/cd.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>\n  </div>\n\n  <div class=\"card\" style=\"width: 100%; max-width: 800px; background-color: #000000; border-radius: 12px; padding: 20px; margin: 10px;\">\n    <h2 style=\"color: #ffffff;\">Checkout, 1, 10 or 1000 Files In One Line</h2>\n    <p style=\"color: #bbbbbb;\">Discover how to use the CHECKOUT command to check out files from the vault.</p>\n    <video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/checkout.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>\n  </div>\n\n  <div class=\"card\" style=\"width: 100%; max-width: 800px; background-color: #000000; border-radius: 12px; padding: 20px; margin: 10px;\">\n    <h2 style=\"color: #ffffff;\">List Directory Content</h2>\n    <p style=\"color: #bbbbbb;\">Explore the DIR command to list files and folders in the current directory.</p>\n    <video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/dir.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>\n  </div>\n\n  \n  <div class=\"card\" style=\"width: 100%; max-width: 800px; background-color: #000000; border-radius: 12px; padding: 20px; margin: 10px;\">\n    <h2 style=\"color: #ffffff;\">Concurrent PDM Sessions</h2>\n    <p style=\"color: #bbbbbb;\">Learn how to use the  LOGIN command to authenticate with the vault.</p>\n    <video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/login.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>\n  </div>\n\n  <div class=\"card\" style=\"width: 100%; max-width: 800px; background-color: #000000; border-radius: 12px; padding: 20px; margin: 10px;\">\n    <h2 style=\"color: #ffffff;\">Options</h2>\n    <p style=\"color: #bbbbbb;\">Understand the various options available in PDMShell to customize your experience.</p>\n    <video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/options.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>\n  </div>\n\n  <div class=\"card\" style=\"width: 100%; max-width: 800px; background-color: #000000; border-radius: 12px; padding: 20px; margin: 10px;\">\n    <h2 style=\"color: #ffffff;\">Power Search Capabilitiy</h2>\n    <p style=\"color: #bbbbbb;\">Learn how to use the Search command to find files and folders efficiently.</p>\n    <video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/search.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>\n  </div>\n\n<div align=\"center\">\n  <a href=\"https://apps.microsoft.com/detail/XPFFXTTJDCW85C?hl=en-US&gl=CA&ocid=pdpshare\" target=\"_blank\">\n    <img src=\"../images/microsoftstore.png\" alt=\"Microsoft Store\" width=\"300\" height=\"150\">\n  </a>\n</div> -->\n\nNeed more power? Choose Premium.\n\nUpgrade to the **Premium Version** of PDMShell to unlock advanced features that take your productivity to the next level. With the Premium Version, you can:\n\n- Call PDMShell directly from other applications, enabling seamless integration into your workflows.\n- Run PDMShell as a **workflow transition action**, automating complex tasks and saving time.\n- Process **unlimited** number of files. Free version caps at items per search.\n\nTake advantage of these powerful features to streamline your PDM operations and enhance your team's efficiency.\n\n[Buy the Premium Version Now](https://bluebyte.biz/product/pdmshell)\n\nNeed more information or want to discuss how PDMShell can fit into your workflow? Schedule a call with us today:  \n[Schedule a Call](https://calendly.com/bluebyte)\n\nContact Us\n\nFor more information or to get in touch with our support team, please refer to the [Contact Us](https://bluebyte.biz/contact) page.\n\n*See EULA page for licensing requirements and restrictions for SOLIDWORKS partners and resellers.",
    "keywords": [
      "index",
      "pdmshell"
    ],
    "category": "general"
  },
  {
    "id": "infovar",
    "title": "INFOVAR Command",
    "content": "DESCRIPTION:\nGets information about a variable.\n\nSYNTAX:\ninfovar [-v variable_name]\n\nPARAMETERS:\n-v variable_name - The variable name to retrieve information for.\n\nEXAMPLES:\ninfovar -v Description\n\nPreview \n\n![InfoVar Command](../images/infovar.png)",
    "keywords": [
      "infovar"
    ],
    "category": "variables"
  },
  {
    "id": "instances",
    "title": "Notes About Running PDMShell in Single Instance Mode",
    "content": "PDMShell can run in two modes:\n\n- **Multi Instance Mode** (default)\n- **Single Instance Mode** (one controller instance, all commands routed to it)\n\nSingle instance mode is useful when you want:\n\n- faster execution for multiple commands\n- automation pipelines that require sequential execution\n\n---\n\nSingle Instance Mode Overview\n\nTo enable **Single Instance Mode**, start PDMShell using:\n\npdmcli.exe /single\n\nor \n\npdmcli.exe -single\n\n![singleinstance](../images/singleinstance.png)\n\nWhen PDMShell is running in **Single Instance Mode**, you’ll see a **single-instance indicator** in the top-right corner of the window. It shows a **“1” icon**, confirming that all commands will be routed to this instance from other **single** instances.\n\nIf PDMShell is **not** running in single instance mode, the indicator will display an **infinity symbol (∞)**, meaning **multiple PDMShell instances are allowed** and each command launches independently in its own PDMShell process.\n\nWith single instance, you can:\n\n✅ launch PDMShell as a single instance controller  \n✅ allow subsequent commands to reuse the same PDMShell instance  \n✅ improve performance if triggered from `cmd.exe` or `Dispatch`   \n✅ prevent multiple conflicting PDMShell instances\n\n### UAC, Permissions, and Single Instance Mode\n\n![singlemodeuac](../images/singlemodeuac.png)\n\nPDMShell’s **Single Instance Mode** relies on Windows’ global mutex system.  Because of this, **User Account Control (UAC)** and **process elevation** matter.\n\nTo attach to the single instance, you must ensure that:\n\n- If the first instance is started as **Admin**, all following calls must also run **as Admin**\n- If the first instance is started **without elevation**, all following calls must also run **without elevation**\n\nAvoid running PDMShell as a Windows Administrator if you have custom add-ins installed.  Check-in and check-out commands can create instances of your add-in inside the host application's memory. If the add-in was registered under a different user or UAC level, PDM will throw a **“Class not registered”** error.\n\nExecuting Commands in Single Instance Mode\n\nOnce PDMShell is running with `/single`, **all subsequent calls to `pdmcli.exe` must also include `/single`**, or PDMShell will launch a new instance instead of attaching.\n\nExample:\n\n    pdmcli.exe /single \"help command checkout\"\n\nThis will:\n\n- connect to the already running instance\n- execute `help command checkout`\n- return output immediately\n\nWhen calling from `cmd.exe`, /single or -single cannot be contained in the double quote.\n\nTips for Single Instance Mode\n\n- Always include `/single` in **every call**\n- [Use proper quote escaping when calling from Dispatch](escapingquotes.md)\n- Use Single Instance mode for sequences of operations\n- Use Multi Instance mode for isolated one-shot commands",
    "keywords": [
      "instances",
      "notes",
      "about",
      "running",
      "pdmshell",
      "single",
      "instance",
      "mode"
    ],
    "category": "system"
  },
  {
    "id": "introduction",
    "title": "Introduction to PDMShell",
    "content": "Welcome to **PDMShell**, the command-line interpreter designed specifically for **SOLIDWORKS PDM Professional**. PDMShell empowers engineers and IT professionals with a **powerful**, **flexible**, and **efficient** tool for automating and streamlining tasks within the SOLIDWORKS PDM environment.\n\n### Using the Help System\n\nPDMShell provides a comprehensive help system and detailed command documentation to guide you through its features. Here's how to get started:\n\n- To view a list of all available commands, type:\n  ```bash\n  help\n  ```\n- To get detailed information about a specific command, type:\n  ```bash\n  help -command <command>\n  ```\n  For example:\n  ```bash\n  help -command cd\n  ```\n\n### Understanding the Command Documentation Structure\nEach command page in PDMShell documentation is organized into the following sections:\n\n1. **DESCRIPTION**: A brief explanation of what the command does.\n2. **SYNTAX**: The syntax for using the command, including required and optional parameters.\n3. **PARAMETERS**: A detailed explanation of each parameter, including whether it is required or optional.\n4. **EXAMPLES**: Practical examples of how to use the command.\n5. **REMARKS**: Additional notes, tips, or special considerations for using the command.\n6. **TUTORIAL**: A short video tutorial demonstrating the command in action (if available).\n\n### Example Command Documentation\nHere’s an example of how a command is documented:\n\n#### CD Command Documentation\n\n**DESCRIPTION**:  \nChanges the current PDM directory.\n\n**SYNTAX**:  \n\ncd [-directory|-id]\n\n**PARAMETERS**:  \n- `directory`: The directory to switch to. The directory parameter can be a relative or absolute path in PDM.  \n- `id`: ID of the folder to navigate to.\n\n**EXAMPLES**:  \n\ncd -directory 'C:\\Vault\\NewFolder' # Navigates to NewFolder\ncd -id 755 # Navigates to the folder with ID 755\n\n**REMARKS**:  \n- Use `cd..` to navigate to the parent folder or `cd\\` to navigate to the root of the vault.  \n- If you just created a new folder and want to `cd` to it using autocomplete, use the `dir` command with the `-refresh` parameter to reload the session.  \n- `directory` is the default parameter, so you don’t need to specify it if it’s the only parameter in your command.  \n\n### Case Sensitivity\n\nAs of **PDMShell 3.0.1**, all **command names**, **parameter names**, and **values** are **case-sensitive**.\n\n### Escaping Quotes\n\nEscaping quotes when passing arguments to PDMShell depends on **where the command originates**. [Please read this dedicated article](escapingquotes.md).\n\n**TUTORIAL**:  \n<video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/cd.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>\n\nBy following this structure, you can quickly learn how to use any command in PDMShell and integrate it into your workflows.\n\n---\n\n📞 Getting Support\n\nIf you need assistance or have any questions, we're here to help!   \n\n- **Contact Us**:  \n  Click the button below to reach out to our support team:  \n  [Get Support](mailto:support@bluebytesystemsinc.zohodesk.com)\n\n---\n\nThank you for choosing **PDMShell**! We’re excited to help you streamline your PDM workflows and unlock new levels of productivity.",
    "keywords": [
      "introduction",
      "pdmshell"
    ],
    "category": "general"
  },
  {
    "id": "kill",
    "title": "KILL Command",
    "content": "DESCRIPTION:\nKills a process.\n\nSYNTAX:\n\nkill -process \n\nPARAMETERS:\n- `process`: The process to terminate (with extension)\n\nEXAMPLES:\n\nkill sldworks.exe\n# terminates all open SOLIDWORKS sessions.\n\nREMARKS:\n- This command uses `taskkill` from the command line.\n- **This command requires PDM to be run as an administrator**. \n- PDMShell adds a note called `ADMIN` in the top-right area of its window when it is open as admin.",
    "keywords": [
      "kill",
      "process"
    ],
    "category": "system"
  },
  {
    "id": "login",
    "title": "LOGIN Command",
    "content": "DESCRIPTION:\nAuthenticates a user to a specified vault.\n\nSYNTAX:\n\nlogin [-auto|-win -username -password|-external -username -password ] -vaultname \n\nPARAMETERS:\n`auto`: Automatic authentication with current user. Displays login dialog box if not logged in.\n\n`win`: Automatic Windows authentication with current user. Does not display login dialog box.\n\n`external`: Toggle ensures that a license is consumed.\n\n`username`:  Username.\n\n`password`:  Password.\n\n`vaultName`: Vault Name.\n\nEXAMPLES:\n\nlogin -username admin -password ******** -vaultName bluebyte #logs into the bluebyte vault with a username ans a password\nlogin -auto -vaultName bluebyte #logs into the blue byte vault using the existing PDM session\n\n# REMARKS: \n\n- You must have a local vault view before you can start using PDMShell.\n- The `external` parameter allows an application that is not supplied and supported by SOLIDWORKS Corporation to:\n  - Log into SOLIDWORKS PDM Professional\n  - Log into a vault view\n\nTUTORIAL:\n <video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/login.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>",
    "keywords": [
      "login",
      "auto",
      "win",
      "external",
      "username",
      "password",
      "vaultname"
    ],
    "category": "authentication"
  },
  {
    "id": "mkdir",
    "title": "MKDIR Command",
    "content": "DESCRIPTION:\nCreates a new folder.\n\nSYNTAX:\n\nmkdir -directory\n\nPARAMETERS:\n- `directory`: The folder to create. Supports placeholders.\n\nFor more information about placeholders, refer to the [placeholders documentation](src/EVAL.html).\n\nEXAMPLES:\n\nmkdir -directory \"NewFolder\"\n# Creates a new folder called NewFolder\n\nREMARKS:\n- To get the new folder to show up in the auto-complete, please use the command `cd -refresh`.\n- `directory` is the default parameter. You do not need to specify it.",
    "keywords": [
      "mkdir",
      "directory"
    ],
    "category": "navigation"
  },
  {
    "id": "mkvar",
    "title": "MKVAR Command",
    "content": "DESCRIPTION:\nCreates a new variable.\n\nSYNTAX:\n\nmkvar -name -varType -mkvarflags -mkvarattributes \n\nPARAMETERS:\n- `name`: The name of the variable to create.\n\n- `varType`: The type of the variable.\n\n- `mkvarflags`: The flags for the variable.\n\n- `mkvarattributes`: The attributes for the variable. Seperated by `#`\n\nEXAMPLES:\n\nmkvar -name \"NewVariable\" -varType \"Text\" -mkvarflags \"ReadOnly\" -mkvarattributes \"Attribute1#Attribute2\"\n\nVAR TYPE VALUES:\n\n| Description                  |\n|------------------------------|\n| None                         |\n| Text                         |\n| Int                          |\n| Float                        |\n| Bool                         |\n| Date                         |\n\nMKVAR FLAGS VALUES:\n\n| Value | Description                                                         |\n|-----------------------------------------------------------------------------|\n| Unique | Values of the variable must be unique; only used for files, ignored for folders |\n| Mandatory | Missing values are not permitted; only used for files, ignored for folders |\n| VerFreeUpdateAll | Every version and every revision, regardless access, workflow states etc., are affected by the variable update |\n| VerFreeLatest | Only the latest version is affected by the variable update  |",
    "keywords": [
      "mkvar",
      "name",
      "vartype",
      "mkvarflags",
      "mkvarattributes"
    ],
    "category": "variables"
  },
  {
    "id": "move",
    "title": "MOVE Command",
    "content": "DESCRIPTION:\nThe `move` command moves file(s) from one folder in the vault to another.\n\nYou can move:\n- A single file\n- All files inside a folder\n- Files returned from a search query\n\nWhen a file is moved:\n- All references are automatically updated by SOLIDWORKS PDM.\n- Any parent files referencing the moved file are updated.\n- File history and versions are preserved.\n\n---\n\nSYNTAX:\n\nmove -source -directory -search -recursive\n\n---\n\nPARAMETERS:\n\n- `source`  \n  The complete file path of the file to move.  \n  You can also specify a folder path. This will move the actual folder.\n  Temporary files starting with `~` are ignored.\n\n- `directory`  \n  Target directory where to move the file(s) to. Must exist in the vault.\n\n- `search`  \n  Search query. Use this to move all search results from the source folder. **This does not support moving folders from a search**\n\n- `recursive`  \n  Affects the search parameter. Specify `-recursive` to make the search recursive.  \n  The start location is the current directory.\n\n---\n\nEXAMPLES:\n\n### Example 1: Move a Single File\n\nmove -source \"C:\\Vault\\Parts\\Bracket.SLDPRT\" -directory \"\\Released\"\nMoves a single file to the Released folder.\n\n---\n\n### Example 2: Move All Files in a Folder\n\nmove -source \"\\Projects\\OldProject\" -directory \"\\Archive\"\nMoves all files inside the specified folder.\n\n---\n\n### Example 3: Move Search Results\n\nmove -source \"\\Projects\" -search \"Name=%.sldprt%\" -recursive -directory \"\\Archive\"\nMoves all part files found in the Projects folder (including subfolders) to the Archive folder.\n\n---\n\nNOTES:\n\n- You must have permission to move the file(s).\n- If the file is referenced by other files, referencing paths are updated automatically.\n- If the file has references, those reference paths are updated automatically.\n- Target directory must already exist in the vault.\n- Move operations preserve version history.",
    "keywords": [
      "move",
      "source",
      "directory",
      "search",
      "recursive"
    ],
    "category": "file-management"
  },
  {
    "id": "movefromsource",
    "title": "MOVEFROMSOURCE Command",
    "content": "DESCRIPTION:\nThe `movefromsource` command moves file(s) in the vault using a CSV file as input.\n\nEach row in the CSV specifies:\n- The File ID\n- The Target Directory\n\nThis command is designed for bulk relocation of files.\n\nWhen a file is moved:\n- All references are automatically updated by SOLIDWORKS PDM.\n- Parent references are updated automatically.\n- File history and versions are preserved.\n\n---\n\nSYNTAX:\n\nmovefromsource -source\n\n---\n\nPARAMETERS:\n\n- `source`  \n  Path to a CSV file containing file IDs and target directories.  \n  The CSV must contain at least two columns:\n  \n  - `FileID`\n  - `TargetDirectory`\n\n---\n\nCSV FORMAT:\n\n### With Header:\n\nFileID,TargetDirectory  \n1234,\\Released  \n5678,\\Archive\\2026  \n\n### Without Header:\n\n1234,\\Released  \n5678,\\Archive\\2026  \n\n---\n\nEXAMPLES:\n\n### Example 1: Basic CSV Move\n\nmovefromsource -source \"C:\\temp\\movefiles.csv\"\nMoves all files listed in the CSV to their respective target folders.\n\n---\n\nNOTES:\n\n- Target directories must already exist in the vault.\n- You must have permission to move the specified files.\n- If a FileID does not exist, that row will be skipped and logged.\n- If a move fails due to permission or state restrictions, it will be reported.\n- Reference updates are handled automatically by SOLIDWORKS PDM.\n- CSV rows with invalid format will be skipped and logged.",
    "keywords": [
      "movefromsource",
      "source",
      "fileid",
      "targetdirectory"
    ],
    "category": "file-management"
  },
  {
    "id": "packandgo",
    "title": "PACKG Command",
    "content": "DESCRIPTION:\nThe `packg` command performs a SOLIDWORKS Pack and Go operation on:\n\n- A single assembly file  \n- Multiple assemblies discovered via directory search  \n- A CSV file containing a list of assembly paths  \n\nThis command launches SOLIDWORKS, executes Pack and Go for each assembly, and saves the results into a specified output directory.\n\nBy default, only `.sldasm` files are processed.\n\nSYNTAX:\n\npackg -source -directory [-search] [-includedrawings] [-recursive] [-prefix] [-suffix] [-timeout]\n\nPARAMETERS:\n\n- `source`  \n  Single assembly file, directory of assemblies, or CSV file containing assembly paths.\n\n- `directory`  \n  Destination folder where Pack and Go results will be saved.  \n  Supports dynamic placeholders:\n  - $filename\n  - $nameWithoutExtension\n  - $directory\n  - $date\n  - $year\n\n- `search`  \n  Search pattern applied when source is a directory.  \n  Default value is `\\.sldasm$`. Supports [regular expressions](https://en.wikipedia.org/wiki/Regular_expression).\n\n- `includedrawings`  \n  Includes associated drawing files (.slddrw) in the Pack and Go operation.\n\n- `recursive`  \n  Searches subdirectories when source is a directory.\n\n- `prefix`  \n  Adds a prefix to all generated file names.\n\n- `suffix`  \n  Adds a suffix to all generated file names.\n\n- `timeout` SOLIDWORKS startup and pack and go timeout in seconds. Default is 30.\n\n---\n\nEXAMPLES:\n\n### Example 1: Pack a Single Assembly\n\nPacks a single assembly and saves results to D:\\Packages\npackg -source \"C:\\Projects\\Top.sldasm\" -directory \"D:\\Packages\"\n\n### Example 2: Pack All Assemblies in a Directory\n\nPacks all assemblies (*.sldasm) in the specified folder\npackg -source \"C:\\Projects\" -directory \"D:\\Packages\"\n\n### Example 3: Recursive Directory Search\n\nSearches subfolders and packs all assemblies found\npackg -source \"C:\\Projects\" -directory \"D:\\Packages\" -recursive\n\n### Example 4: Use Regex Search\n\nPacks only assemblies that start with TOP_\npackg -source \"C:\\Projects\" -search \"^TOP_.*\\.sldasm$\" -directory \"D:\\Packages\"\n\n### Example 5: Pack Assemblies from CSV\n\nReads assembly paths from a CSV file and packs each one \npackg -source \"C:\\Batch\\assemblies.csv\" -directory \"D:\\Packages\"\n\n### Example 6: Include Drawings\n\nIncludes associated drawing files in Pack and Go\npackg -source \"C:\\Projects\\Top.sldasm\" -directory \"D:\\Packages\" -includedrawings\n\n### Example 7: Prefix and Suffix\n\nAdds prefix and suffix to all packed files\npackg -source \"C:\\Projects\\Top.sldasm\" -directory \"D:\\Packages\" -prefix \"SW_\" -suffix \"_Release\"\n\n### Example 8: Increase SOLIDWORKS Timeout\n\nAllows more time for SOLIDWORKS to launch\npackg -source \"C:\\Projects\" -directory \"D:\\Packages\" -timeout 300",
    "keywords": [
      "packandgo",
      "packg",
      "source",
      "directory",
      "search",
      "includedrawings",
      "recursive",
      "prefix",
      "suffix",
      "timeout"
    ],
    "category": "file-management"
  },
  {
    "id": "parameter_short_format",
    "title": "Short Format for Parameters in PDMShell",
    "content": "Overview\n\nPDMShell supports short formats for many of its parameters to make commands more concise and easier to use. These short formats are defined for specific parameters and can be used as an alternative to their full names. Below is a comprehensive list of parameters and their corresponding short formats.\n\n---\n\nList of Parameters and Their Short Formats\n\n| **Parameter**            | **Short Format** | **Description**                                                                 |\n|---------------------------|------------------|---------------------------------------------------------------------------------|\n| `username`               | `u`              | Specifies the username for authentication.                                      |\n| `password`               | `p`              | Specifies the password for authentication.                                      |\n| `vaultName`              | `v`              | Specifies the name of the PDM vault.                                            |\n| `filePath`               | `f`              | Specifies the file path to operate on.                                          |\n| `command`                | `c`              | Specifies the command name.                                               |\n| `search`                 | `s`              | Specifies the search query. Can use % for wildcard.                                                    |\n| `directory`              | `d`              | Specifies the directory to operate on.  Wrap in \"\" if there are spaces.                                         |\n| `columns`                | `cols`           | Specifies the columns to include in the output. Wrap in \"\" if there are spaces. Seperate multiple by comma.                                 |\n| `csv`                    | `csv`            | Specifies the CSV file to use. You need to include extension.                                                 |\n| `sort`                   | `sort`           | Specifies the sorting order by column name. Used only in `dir` command.                                                    |\n| `programName`            | `prog`           | Specifies the program name.                                                     |\n| `configNames`            | `configs`        | Specifies the configuration names. Wrap in \"\" if there are spaces. Seperate multiple by comma.                                               |\n| `value`                  | `val`            | Specifies the value to set. Wrap in \"\" if there are spaces.                                                    |\n| `version`                | `ver`            | Specifies the version of the file or software.                                  |\n| `variableName`           | `var`            | Specifies the name of the variable.                                             |\n| `clearToggle`            | `cls`            | Toggles clearing the variable. Used only `setvar` command.                                           |\n| `comment`                | `cmt`            | Specifies a comment during check-in. Wrap in \"\" if there are spaces.                                                           |\n| `checkinoptions`         | `ciopt`          | Specifies options for check-in operations.                                      |\n| `oldVersion`             | `oversion`       | Specifies the old version of the file.                                          |\n| `refresh`                | `refresh`        | Refreshes the current session autocomplete list. Use with `dir`.                                                  |\n| `checkinouttoggle`       | `checkinouttoggle` | Toggles check-in or check-out operations.                                       |\n| `process`                | `process`        | Specifies the process to execute.                                               |\n| `list`                   | `list`           | Lists items based on the specified criteria.                                     |\n| `batch`                  | `batch`          | Specifies batch operations.                                                     |\n| `id`                     | `id`             | Specifies the ID of the file or folder.                                         |\n| `mkvarattributes`        | `mkvarattributes`| Specifies attributes for variable creation.                                     |\n| `TransitionID`           | `trid`           | Specifies the transition ID.                                                    |\n| `source`                 | `source`         | Specifies the source file or folder.                                            |\n| `destory`                | `dest`           | Specifies the destination file or folder.                                       |\n| `recursive`              | `recursie`       | Toggles recursive operations.                                                   |\n| `extensions`             | `ext`            | Specifies file extensions to include.                                           |\n| `ignoreexisting`         | `ignoreex`       | Ignores existing files or folders.                                              |\n| `date`                   | `date`           | Specifies the date.                                                             |\n| `updaterefs`             | `updaterefs`     | Updates references for files or folders.                                        |\n| `includesubfolders`      | `includesubfolders` | Includes subfolders in the operation.                                          |\n| `includeproperties`      | `includeproperties` | Includes properties in the operation.                                          |\n| `toolboxflag`            | `toolboxflag`    | Toggles the toolbox flag.                                                       |\n| `evaluatealias`          | `evaluatealias`  | Evaluates aliases for dynamic placeholders.                                     |\n| `stringformat`           | `stringformat`   | Specifies the string format.                                                    |\n| `taskName`               | `taskName`       | Specifies the name of the task.                                                 |\n| `suffix`                 | `suffix`         | Specifies a suffix to append.                                                   |\n| `prefix`                 | `prefix`         | Specifies a prefix to prepend.                                                  |\n| `includedrawings`        | `includedrawings` | Includes drawings in the operation.                                            |\n| `latest`                 | `latest`         | Toggles the use of the latest version.                                          |\n\n---\n\nUsage Example\n\nHere’s an example of using short formats in a command:\n\n### Full Format\n\nsetvar -filePath \"C:\\Vault\\File.sldprt\" -variableName \"VariableName\" -value \"NewValue\"",
    "keywords": [
      "parameter_short_format",
      "short",
      "format",
      "parameters",
      "pdmshell"
    ],
    "category": "general"
  },
  {
    "id": "print",
    "title": "PRINT Command",
    "content": "DESCRIPTION:\nDisplays the biographical information about the specified file.\n\nSYNTAX:\n\nprint [-filePath|-id]\n\nPARAMETERS:\n-filePath: The file to print biographical information for.\n\nEXAMPLES:\n\nprint -filePath \"C:\\SOLIDWORKSPDM\\Bluebyte\\API\\Sandbox\\fidget spinner\\___108545.SLDPRT\"\n\nThe print command will print an output like the following: \n\nFile Name     : ___108545.SLDPRT\nLocal Path    : C:\\SOLIDWORKSPDM\\Bluebyte\\API\\Sandbox\\fidget spinner\\___108545.SLDPRT\nFolder Path   : \\API\\Sandbox\\fidget spinner\n\nFile ID       : 115310\nFolder ID     : 457\n\nHEXID         : 1C26E\nArchive Path  : E\\0001C26E\n\nChecked out?  : False\n\nState ID      : 158\nState Name    : New State\nCurrent state : New State [Workflow: Vaulted]\nCurrent Ver   : 7\nCurrent Rev   : \n\nTransitions   :\nReturn Engineering [193] From New State [158] To In Design [9]",
    "keywords": [
      "print"
    ],
    "category": "file-management"
  },
  {
    "id": "printfromsource",
    "title": "PRINTFROMSOURCE Command",
    "content": "DESCRIPTION:\nThe `printfromsource` command is used to validate a list of filepaths in the PDM system based on a source CSV file. The CSV file must contain a header and a list of complete file paths in the first column.\n\n---\n\nSYNTAX:\n\nprintfromsource -filePath -csv \n\nPARAMETERS:\n- `filePath`: (Required) The source file path. This must be a CSV file with one column:\n - file Path: Complete file path.\n- `csv`: Specifies the output csv. This will contains information about files from the source parameter.\n\nEXAMPLES:\nRename files using a source CSV file:\n\nprintfromsource -filePath \"source.csv\" -csv \"output.csv\" \n\nREMARKS:\n- The `filePath` parameter is mandatory and must point to a valid CSV file.\n- The `csv` is the output from the verification process `printfromsource` performs:\n\n| ID | Complete File Path | Folder ID | Checked Out | Where Used ID |\n|----|---------------------|------------|--------------|----------------|\n| 1  | C:\\Vault\\ProjectA\\Part1.SLDPRT | 105 | FALSE | 5021 |\n| 2  | C:\\Vault\\ProjectB\\Drawing1.SLDDRW | 106 | TRUE | 5022 |\n| 3  | C:\\Vault\\ProjectC\\Assembly1.SLDASM | 107 | FALSE | 5023 |",
    "keywords": [
      "printfromsource",
      "filepath",
      "csv"
    ],
    "category": "file-management"
  },
  {
    "id": "quit",
    "title": "QUIT Command",
    "content": "DESCRIPTION:\nQuits the application.\n\nSYNTAX:\n\nquit -silent\n\nPARAMETERS:\n- `-silent`:\n(Optional) suppresses the close dialog box.\n\nREMARKS:\n- This command runs silently in scripts. Read more about [scripting](/src/scripting.html).",
    "keywords": [
      "quit"
    ],
    "category": "system"
  },
  {
    "id": "reboot",
    "title": "REBOOT Command",
    "content": "DESCRIPTION:\nHard PDM reboot.\n\nSYNTAX:\n\nreboot\n\nPARAMETERS:\nThis command has no parameters.\n\nEXAMPLES:\n\nreboot\n\nREMARKS:\n- This command uses `taskkill` from the command prompt to kill `explorer.exe` and `edmserver.exe` then restart `explorer.exe`.\n- It requires PDM to be run as an administrator.",
    "keywords": [
      "reboot"
    ],
    "category": "system"
  },
  {
    "id": "recover",
    "title": "RECOVER Command",
    "content": "DESCRIPTION:\nThe `recover` command is used to recover files from a specified directory or source. It supports optional parameters for search queries and recursive operations.\n\nSYNTAX:\n\nrecover -directory -search -recursive -source \n\nPARAMETERS:\n\n- `directory`: Specifies the directory to recover files from. This parameter is optional.\n- `search`: A search query to filter the files to recover. This parameter is optional. Supports % and * as wildcards.\n- `recursive`: Enables recursive recovery of files within subdirectories. This parameter is optional.\n- `source`: Specifies the source to recover files from. This parameter is optional.\n\n- To generate a source csv file, use the command `delete -list -csv deletedfiles.csv` to generate a list of all deleted files in the current directory.\n- You can include `recursive` to get all files from the subdirectories.\n- To generate a source csv file for a particular directory, use `directory` in combination with `list` and `csv`. \n\nEXAMPLES:\n\nrecover -source \"source.csv\"\n# Recovers files from the specified source.\nrecover -directory \"\"\n# Recovers files from the current directory.\n\nREMARKS:\n- Ensure that the specified directory or source exists and is accessible.\n\nTUTORIAL:\n <video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/recover.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>",
    "keywords": [
      "recover",
      "directory",
      "search",
      "recursive",
      "source",
      "list",
      "csv"
    ],
    "category": "file-management"
  },
  {
    "id": "releasenotes",
    "title": "3.0.57 (2026-03-22)",
    "content": "To update PDMShell properly, **download** the latest version, **uninstall** PDMShell and \nthen **install** the latest version. **Do not update installed version.**\n\n- `dir`: Fixed search bug causing dir listing to be incomplete. \n\n# 3.0.56 (2026-03-22)\n- Enhanced `runscript` and fixed minor bugs in TaskScript. \n- Added a new TaskScript demo\n# 3.0.55 (2026-03-20)\n- Added a quick access button to PDMShell AI assistant\n# 3.0.54 (2026-03-20)\n- `deletefromsource`: API workaround for IEdmBatchDelete3 \n# 3.0.53 (2026-03-18)\n- `deletefromsource`: Fixed some bugs \n\n# 3.0.52 (2026-03-17)\n- internal build\n\n# 3.0.51 (2026-03-17)\n- internal build\n\n# 3.0.50 (2026-03-16)\n- `updatesreferences`: added `csv` to save output.\n# 3.0.49 (2026-03-16)\n- Adding verbose logging to to `addtovault`\n- `setvarfromsource`: Added error message to error code. \n\n# 3.0.48 (2026-03-15)\n- Minor change to `addtovault`: existing files found during add will be added to results file from parameter `csv`.\n- Added TaskScript add-in to run tasks with PDMShell (Similar to convert task). \n\n# 3.0.47 (2026-03-07)\n- Added `edit` token to search. This will force a check out and check-in when using a PDM `-search` during any command. \n- Added `version` to specify the version of SOLIDWORKS to use in `export` and `runswmacro` commands. \n \n\n# 3.0.46 (2026-03-06)\n- Expanded `source` to take folder in [move](MOVE.md): This allow folders to be moved.\n\n# 3.0.45 (2026-03-06)\n- Add `label` parameter to [addtovault](ADDTOVAULT.md)\n\n# 3.0.44 (2026-03-03)\n- Add `count`, `clear`, `skip` parameters to [addtovault](ADDTOVAULT.md)\n\n# 3.0.42 (2026-03-02)\n- Small bugs fixes with the `csv` parameter in [addtovault](ADDTOVAULT.md)\n- If you specify the word \"DELETE\" in the value of the custom property in the `propertymap`, PDMShell will delete the property prior to adding the file.\n\n# 3.0.41 (2026-03-01)\n- Added `propertymap` parameter to allow to set custom property prior to adding files to vault from a csv file.\n- Changed `list` parameter in [addtovault](ADDTOVAULT.md) to `map`\n\n# 3.0.40\n# 3.0.39\nGhost builds\n\n# 3.0.38 (2026-02-26)\n- Added `update` parameter and changed the logic `refresh` parameter [DocManProps](DOCMANPROPS.md): `Update` now updates the files and `refresh` refresh the csv.\n\n# 3.0.37 (2026-02-25)\n- Added `list` parameter to [addtovault](ADDTOVAULT.md): CSV mapping file list\n- Added `batch` parameter to [addtovault](ADDTOVAULT.md).\n- Improved performance with large data sets [addtovault](ADDTOVAULT.md). \n\n# 3.0.36 (2026-02-24)\n- Ignored temporary files in [DocManProps](DOCMANPROPS.md).\n- Added support for listing non-solidworks in output of [DocManProps](DOCMANPROPS.md).\n# 3.0.35 (2026-02-23)\n# 3.0.34 (2026-02-23)\n- Fixed bug when enumerating large data volume [DocManProps](DOCMANPROPS.md).\n- pdmcli.exe now signed with a verified publisher.\n\n# 3.0.33 (2026-02-21)\n- Fixed escape and unescape bug in default mode in [DocManProps](DOCMANPROPS.md) command.\n- Add `extensions` parameter to [DocManProps](DOCMANPROPS.md) command.\n\n# 3.0.32 (2026-02-20)\n- Added documentation for the `transition`  [Transition](TRANSITION.md) command.\n\n# 3.0.31 (2026-02-20)\n- Added `docmanprops` to edit properties using the document manager [DocManProps](DOCMANPROPS.md) command.\n\n# 3.0.30 (2026-02-17)\n- Added `batch` parameter for destroying files in the [DeleteFromSource](DELETEFROMSOURCE.md) command.\n\n# 3.0.29 (2026-02-16)\n- Minor changes and updates to the docs.\n\n# 3.0.28 (2026-02-11)\n- Added `DuplicatedBy` token to advanced search and `DuplicateStrategy` parameter to the search command.\n- Added [Move](MOVE.md) and [MoveFromSource](MOVEFROMSOURCE.md) commands.\n# 3.0.27 (2026-02-09)\n- Added [Pack And Go](PACKANDGO.md)\n- Updated [Where Used](WHEREUSED.md)  \n\n# 3.0.26 (2026-01-05)\n- Happy New Year 2026 🎊!\n- [get command](GET.md): `Directory` parameter is now **optional**. If not specified, the file is cached in its folder. If specified with an empty value, the file is cached at the root of the vault.\n- Update tooltip for the `source` parameter in the [clear cache command](CLEARACACHE.md)\n\n# 3.0.25 (2025-12-23)\n- No added commands or bug fixes.  \n- Updated parameters tooltip in `addtovault`, `rename`, `cd` and others.\n\n# 3.0.24 (2025-12-22)\n- parameter tooltips (little box that shows up next to the parameter when you type in the command box) are now uniaue for each command. Over the next releases, we will update all tooltips for all parameters to make them more clear. The same parameter can be used in multiple commands having different function in each.\n\n# 3.0.23 (2025-12-20)\n- Added [update references command](UPDATEREFERENCES.md)\n\n# 3.0.22 (2025-12-19)\n- Added [copy command](COPY.md)\n\n# 3.0.21 (2025-12-18)\n- Fixed single instance bug. All commands are now executed sequentially. Output is not during commands execution anymore. This was in 3.0.19 and 20\n- Added `getoptions` in [Get](GET.md)\n- Added `checkoutoptions` in [Checkout](CHECKOUT.md)\n\n# 3.0.20 (2025-12-12)\n- Fixed timeout issue with [Export](EXPORT.md) and [RunSwMacro](RUNSWMACRO.md).\n- Added `name`, `filePath` and `value` parameters to [INBOX](INBOX.md). \n- `source` parameter default to current directory in [addtovaultcommmand](ADDTOVAULT.md). \n\n# 3.0.19 (2025-12-11)\n- Added `winlog` parameter for pdmcli.exe. See remarks section of [dump command](DUMP.md).\n- Fixed single instance bug. All commands are now executed sequentially. Output is blocked during commands execution.\n\n# 3.0.18 (2025-12-08)\n- Rebuild. Previous faulty build.\n\n# 3.0.17 (2025-12-08)\n- Fixed single instance issue related to Windows enviornment variables\n- Added note for `solidworks` and `pdm`parameters in the [Version](VERSION.md) command: **RESERVED FOR FUTURE. NOT IMPLEMENTED**   \n\n# 3.0.16 (2025-12-07)\n- [Export: Added timeout parameter launching SOLIDWORKS](EXPORT.md).\n- [RunSwMacro: timeout parameter is also enabled for launching SOLIDWORKS](RUNSWMACRO.md).\n- Enforced `.pdmshell` extension across all commands as the scripting file extension.\n# 3.0.15\n- skipped\n\n# 3.0.14 (2025-12-05)\n- [Login: Fix bug with parameter casing](LOGIN.md).\n- [Login: Added implementation with the transition command](TRANSITION.md).\n- Updated documentation\n\n# 3.0.13 (2025-12-04)\n- [VERSIONUPGRADE: Added a new command](VERSIONUPGRADE.md).\n- [VERSIONUPGRADEFROMSOURCE: Added a new command (Reserved but not implemented)](VERSIONUPGRADEFROMSOURCE.md).\n\n# 3.0.12 (2025-12-03)\n- [SetRevisionFromSource: Added a new command](SETREVISIONFROMSOURCE.md).\n\n# 3.0.11 (2025-12-02)\n- [SetRevision: Added a new command](SETREVISION.md).\n - Fixed evaluation bug: Bracketed variable `[Variable]` fail to evaluate in `name` and `value` parameters\n\n# 3.0.10 (2025-12-01)\n- Rebuild\n\n# 3.0.9 (2025-12-01)\n - [INFOVAR: Fixed bug with related to single flag variables](INFOVAR.md) \n - [SETVAR: Added support for handling folder cards](SETVAR.md) \n\n# 3.0.8 (2025-11-30)\n - Fixed unhandled exception when license is limited that causes a crash in all commands\n - Fixed evaluation bug (order)\n - Fixed some minor bugs in BOM command\n\n# 3.0.7 (2025-11-29)\n - [BOM: Added a new command](BOM.md). Please see notes [here](howtoinstall.md#common-update-issues) about new commands in the **Common Update Issues** section.\n - [Added `$configuration` placeholder](EVAL.md)\n - Added release notes page\n - Fixed some minor typos for the delete and destroy commands\n - Change toolbar icons and tooltips for better UX",
    "keywords": [
      "releasenotes"
    ],
    "category": "general"
  },
  {
    "id": "rename",
    "title": "RENAME Command",
    "content": "DESCRIPTION:\nRenames a specified file.\n\nSYNTAX:\n\nrename -filePath -value -search\n\nPARAMETERS:\n- `filePath`: The filerename.\n- `value`: The new name for the file. **YOU MUST INCLUDE THE EXTENSION**\n- `search`: The search operation to use.\n\nEXAMPLES:\n\nrename -filePath \"oldname.sldprt\" -val \"newname.sldprt\"\n\nREMARKS:\n- The search parameter searches the current directory and does not drill down. The search query is a PDM one, so you can use `%` for wildcard.\n\nVALUE EVALUATION:\nThe `value` parameter gets evaluated by PDMShell. PDMShell allows you to use placeholders in the new name, which will be replaced with actual values from the file. This can be useful to dynamically generate new names based on file properties or other variables. The following placeholders are supported:\n\n- `$filename` - The file name without extension.\n- `$id` - The file ID.\n- `$revision` - The current revision of the file.\n- `$date` - The current date.\n- `$time` - The current time.\n- `$version` - The current version of the file.\n- `$extension` - The file extension.\n\nAdditionally, you can use variables enclosed in square brackets (e.g., `[VariableName]`) to include values from other variables.\n\nPlease read more information about placeholder evaluation [here](EVAL.md).\n\nEXAMPLES:\nIf you use the value `\"$filename_$date_$version$extension\"`, it will be replaced with the file name, current date, and version, resulting in something like `\"oldname_10-12-2023_3\"`.",
    "keywords": [
      "rename",
      "filepath",
      "value",
      "search"
    ],
    "category": "file-management"
  },
  {
    "id": "renamefromsource",
    "title": "RENAMEFROMSOURCE Command",
    "content": "DESCRIPTION:\nThe `renamefromsource` command is used to rename files in the PDM system based on a source CSV file. The CSV file provides the necessary information to map file IDs to their new names and folder IDs. This command supports alias evaluation for dynamic renaming.\n\n---\n\nSYNTAX:\n\nrenamefromsource -filePath -evaluatealias -csv \n\nPARAMETERS:\n- `filePath`: (Required) The source file path. This must be a CSV file with three columns:\n\n1. File ID: The ID of the file to be renamed.\n2. New File Name: The new file name, including the extension.\n3. Folder ID: The ID of the folder containing the file.\n\n- `evaluatealias`: Toggle. This allows placeholders to be used in the new file name.\n- `csv`: Specifies the path to an additional CSV file for batch renaming.\n\nEXAMPLES:\nRename files using a source CSV file:\n\nrenamefromsource -filePath \"C:\\data\\rename.csv\" -evaluatealias  \n# renames all the files in rename.csv while evaluating aliases\n\nCSV FORMAT:\nThe source CSV file must have the following structure:\n\n| File ID | New File Name           | Folder ID |\n|---------|--------------------------|-----------|\n| 123     | newfile1.txt             | 456       |\n| 124     | anotherfile.docx         | 457       |\n| 125     | examplefile_backup.pdf   | 458       |\n\n- **File ID**: The ID of the file to be renamed.  \n- **New File Name**: The desired new name for the file, including the extension.  \n- **Folder ID**: The ID of the folder containing the file.\n\nREMARKS:\n- The `filePath` parameter is mandatory and must point to a valid CSV file.\n- The `evaluatealias` parameter supports dynamic placeholders for renaming, such as $name, $revision, $yyyy, etc. Ensure the CSV file is properly formatted with three columns: File -ID, New File Name, and Folder ID.\n- The `csv` parameter is optional and can be used to provide additional renaming data.\n\nFor more information about alias evaluation, refer to the [Dynamic Placeholders in PDMShell](EVAL.html).\n\nTUTORIAL:\n <video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/renamefromsource.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>",
    "keywords": [
      "renamefromsource",
      "filepath",
      "evaluatealias",
      "csv"
    ],
    "category": "file-management"
  },
  {
    "id": "runscript",
    "title": "RUNSCRIPT Command",
    "content": "DESCRIPTION:\nRuns a PDMShell script.\n\nSYNTAX:\n\nrunscript -source -filePath -search -recursive\n\nPARAMETERS:\n- `source`:  Script file.  **Must end in `.pdmshell`** \n\nScript extension is `.pdmshell`\n\n- `filePath`:  File path to run the script on. \n- `search`:  Search query to filter files.\n- `recursive`: If specified, the command will run script on all files recursively in subdirectories.  \nEXAMPLES:\n ```bash\nrunscript -filePath pdmscript.pdmshell -search \"%.sldprt\" -recursive \n# this will run pdm.script on all part files in the active directory and its subdirectories\n ```\n\nREMARKS:\n- A good way to start a script is using the `start notepad.exe` command to open up notepad.exe.\n- In your script, you must use the alias `$completefilename` and `$completefoldername` to reference the file your script is targeting. This is required with the `search` or `filePath` parameters. \n\nFREE VERSION LIMIT:\n- The free version is limited to 10 lines per script.",
    "keywords": [
      "runscript",
      "source",
      "filepath",
      "search",
      "recursive"
    ],
    "category": "scripting"
  },
  {
    "id": "runswmacro",
    "title": "RUNSWMACRO Command",
    "content": "DESCRIPTION:\n\nThe `RunSWMacro` command allows you to execute a SOLIDWORKS macro on a specific file or on multiple files found via search in the PDM vault. This is useful for automating repetitive tasks or applying custom logic to many files.\n\nSYNTAX:\n\nrunswmacro -filePath -search -recursive -list -skip -count -timeout\n\nPARAMETERS:\n\nThe command requires the following parameters:\n\n- `filePath`: Path to the SOLIDWORKS macro file (`.swp` or `.dll`). This is required and the file needs to cached in PDM.\n- `search`: Search query to find files to run the macro on.\n- `recursive`: If set, search will include subfolders.\n- `list`: csv file path of filepaths without a column header.\n- `skip`: Skips the specified number of items. Only valid with `list`.\n- `count`: Only processes the specified number of items. Only valid with `list`.\n- `timeout`: Macro timeout in seconds (for both the macro to execute and for SOLIDWORKS to start too)\n- `version`: SOLIDWORKS year version. Example 2023. Default is latest.\n\nWhat version of SOLIDWORKS will PDMShell use?\nPDMShell will use the latest SOLIDWORKS version installed on your system by checking the Windows Registry at:\n\nHKEY_LOCAL_MACHINE\\SOFTWARE\\SolidWorks\n\nIf you have multiple SOLIDWORKS versions installed, PDMShell will automatically select the most recent version found in the registry.\n\nList Example\n\nC:\\TestVault\\part1.sldprt\nC:\\TestVault\\assembly2.sldasm\nC:\\TestVault\\drawing3.slddrw\nC:\\TestVault\\bracket4.sldprt\n\nSWP Macro\n\nPlease read the remarks below to properly call your macro.\n\n- The macro procedure name must be called `main`.\n- The macro module name must be called the file name of the macro appended by `1`. Example: If the macro called `print.swp` the module name must be called `print1`.\n\nDLL Macro\nPlease read the requirements below to properly create your DLL macro.\n\n### Requirements\n- The macro class must implement the `IPDMShellSOLIDWORKSMacro` interface\n- The class must be decorated with the `PDMShellMacro` attribute\n- The interface can be found in the NuGet package `BlueByte.PDMShell.SOLIDWORKSMacro` on nuget.org\n\n### Required NuGet Package Versions\n\nYour project must use these specific versions of the NuGet packages:\n\n<PackageReference Include=\"BlueByte.PDMShell.SOLIDWORKSMacro\" Version=\"1.0.0\" />\n<PackageReference Include=\"BlueByte.SOLIDWORKS.Interops\" Version=\"2019.0.0\" />\n<PackageReference Include=\"BlueByte.SOLIDWORKS.PDMProfessional.Interops\" Version=\"2024.5.50\" />\n\nInstall using Package Manager Console:\n\nInstall-Package BlueByte.PDMShell.SOLIDWORKSMacro -Version 1.0.0\nInstall-Package BlueByte.SOLIDWORKS.Interops -Version 2019.0.0\nInstall-Package BlueByte.SOLIDWORKS.PDMProfessional.Interops -Version 2024.5.50\n\nUsing different versions may result in compatibility issues or runtime errors.\nThese specific versions are tested and guaranteed to work with PDMShell.\n\n### Example Implementation\n\nusing PDMShellSOLIDWORKSMacro;\nusing SolidWorks.Interop.sldworks;\nusing EPDM.Interop.epdm;\n\n[PDMShellMacro]\npublic class MyMacro : IPDMShellSOLIDWORKSMacro\n{\n    public bool Execute(\n        SldWorks swApp, \n        IEdmFile5 pdmFileObject, \n        IEdmFolder5 pdmFolderObject, \n        int handle, \n        string progress, \n        IPDMCmdLineCallback callback, \n        out string error)\n    {\n        error = string.Empty;\n        // Update progress using the callback\n        callback.AppendMessage(\"Starting macro execution...\");\n        \n        // Your macro implementation here\n        callback.AppendMessage($\"Processing file: {pdmFileObject.Name}\");\n        \n        // Report completion\n        callback.AppendMessage(\"Macro execution completed successfully\");\n\n        return true;\n    }\n}\n\nUse the `callback.AppendMessage()` method to provide progress updates and status messages during macro execution. These messages will be displayed in the PDMShell output.\n\n### Running the Macro\n\n# Run the DLL macro on all parts in the current directory\nrunswmacro -filePath \"Macros/MyMacro.dll\" -search \"%.sldprt\" -timeout 12000\n\nThe DLL must be built against .NET Framework 4.7.2 or higher\n\nEXAMPLES:\n\n# run batch export macro on all part in the current directory\n runswmacro -filePath \"Macros/BatchExport.swp\" -search \"%.sldprt\" \n ```\n\nYou can use the token `edit` in the search to force a check out and a check in of the search results. The check out uses the default checkout settings specified in the reference dialog of your PDM user settings (ie: this might check out the file itself and its references too). The check in will only check in the document itself (**not the references**).\n\n# run batch export macro on all part in the current directory (does a checkout and check in of the parts)\n runswmacro -filePath \"Macros/BatchExport.swp\" -search \"Name=%.sldprt;Edit\" \n ```",
    "keywords": [
      "runswmacro",
      "filepath",
      "search",
      "recursive",
      "list",
      "skip",
      "count",
      "timeout",
      "version"
    ],
    "category": "scripting"
  },
  {
    "id": "runtask",
    "title": "RUNTASK Command",
    "content": "DESCRIPTION:\n\nThe `RUNTASK` command allows you to execute a PDM task on a specific file or via search in the PDM vault. \n\nSYNTAX:\n\nruntask -taskName -filePath -search -recursive\n\nPARAMETERS:\n\nThe command requires the following parameters:\n\n- `taskName`: Task name. This can be found in under Tasks in the Administration tool.\n- `filePath`: Path to the affected file.\n- `search`: (Optional) Search query to find files to run the macro on.\n- `recursive`: (Optional) If set, search will include subfolders.\n\nEXAMPLE:\n\n# run PrintPDF task on an assembly\n taskrun -TaskName \"PrintPDF\" -filePath \"Assembly.sldasm\"  \n ```",
    "keywords": [
      "runtask",
      "taskname",
      "filepath",
      "search",
      "recursive"
    ],
    "category": "scripting"
  },
  {
    "id": "scripting",
    "title": "Scripting in PDMShell",
    "content": "Overview\nPDMShell supports scripting to automate tasks and streamline workflows. Scripts use the `.pdmshell` file extension and are plain text files, making them easy to create and edit using any text editor, such as Notepad.\n\n---\n\nCreating a Script\nA PDMShell script is a sequence of PDMShell commands written in a plain text file. Each command is executed in the order it appears in the script.\n\n### Script File Extension\nScript file extension is `.pdmshell`.\n\n### Example Script\nBelow is an example of a `.pdmshell` script:\n\n# filepath: example.pdmshell\n# This script automates exporting and adding files to the vault.\n\n# Navigate to the working directory\ncd \"\\api\\sandbox\\fidget spinner\"\n\n# Create a new export folder with a dynamic name using the current folder\nmkdir \"$name-export-$date\"\n\n# Export all SolidWorks part files to the new folder as STEP files\nexport -search %.sldprt -directory \"$name-export-$date\" -extensions stp -name $namewithoutextension-$yyyy-$mm-$dd\n\n# Change to the newly created export folder\ncd \"$name-export-$date\"\n\n# Add the exported files to the vault as stp files are NOT automatically added\naddtovault -source \" \"\n\n# Check in all files in the current folder\ncheckin -search %\n\n# Open the folder in File Explorer\nstart .\n\n### Script Annotations\n1. **`cd \"\\api\\sandbox\\fidget spinner\"`**: Changes the current working directory to the specified path.\n2. **`mkdir \"$name-export-$date\"`**: Creates a new folder with a dynamic name based on the current date and the folder name.\n3. **`export`**: Exports all `.sldprt` files in the current directory to the newly created folder as `.stp` files, appending the current date to the file names.\n4. **`cd \"$name-export-$date\"`**: Changes the working directory to the newly created export folder.\n5. **`addtovault`**: Adds the exported files to the vault.\n6. **`checkin`**: Checks in all files in the current folder to the vault.\n7. **`start .`**: Opens the current folder in File Explorer.\n\n---\n\n### Comments\n\nLines that start with `#` are ignored.\n\nExecuting a Script\nThere are two ways to execute a `.pdmshell` script:\n\n### 1. Using `pdmcli.exe`\nYou can execute a script using the `pdmcli.exe` command-line tool. Provide the script file as the first argument, wrapped in quotes if the file path contains spaces.\n\n#### Example Command\n\npdmcli.exe \"C:\\Scripts\\example.pdmshell\"\n\nThe `pdmcli.exe` tool can be found in the installation folder under `Program Files (x86)\\BLUE BYTE SYSTEMS INC`.\n\n### 2. Using the `runscript` Command\nYou can also execute scripts directly from the PDMShell console using the `runscript` command.\n\n[Note]\n\n#### Example Command\n\nrunscript -source \"C:\\Scripts\\example.pdmshell\"\n\nFor more information about the `runscript` command, refer to the [runscript documentation](RUNSCRIPT.html).\n\n---\n\nWorkflow Integration\nFor users with the **Premium Version** of PDMShell, `pdmcli.exe` can be hooked into workflow transitions. This allows scripts to be executed automatically as part of a workflow, enabling seamless automation of complex processes.\n\n---\n\nRemarks\n- Scripts are a powerful way to automate repetitive tasks and enforce consistency in workflows.\n- Since `.pdmshell` files are plain text, they can be created and edited using any text editor.\n- Ensure the script file is saved with the `.pdmshell` extension for proper execution.\n- Use comments (`#`) in scripts to document the purpose of each command for better readability.\n\nTUTORIAL:\n <video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/scripting.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>\n\nLet Blue Byte Systems Write Your Scripts\nIf you need assistance creating scripts for your specific workflows, Blue Byte Systems offers professional scripting services. Their team of experts can design and implement custom .pdmshell scripts tailored to your requirements, ensuring optimal efficiency and accuracy.\n\nTo learn more about this service, contact Blue Byte Systems directly through their support page.",
    "keywords": [
      "scripting",
      "pdmshell"
    ],
    "category": "scripting"
  },
  {
    "id": "scriptsfromtransition",
    "title": "Notes About Running PDMShell Scripts from Workflow Transitions",
    "content": "When you want to run PDMShell scripts as part of a workflow transition in SOLIDWORKS PDM, you can configure the transition to execute scripts seamlessly. This allows you to automate complex tasks during transitions, such as updating variables, exporting files, or triggering external processes.\n\nWorkflow Transition Configuration\n\n![workflowtransition](../images/worktransition.png)\n\n1. **Action Type**: Set the action type to **Execute Command**.\n2. **Command**: Specify the path to the PDMShell executable, which is `pdmcli.exe`.  \n   ```bash\n   \"path_to_pdmcli.exe\" runscript \"pathToScript\" [additional parameters]\n   ```\n\n- The `pathToScript` must be wrapped in quotes (`\"\"`) if it contains spaces.\n- Additional parameters can be passed to the script as needed aslo wrapped in quotes (`\"\"`).\n- Make to sure to check `Wait until the started program terminates.`\nExample: Workflow Transition Execute Command Configuration\n\n\"C:\\Program Files (x86)\\BLUE BYTE SYSTEMS INC\\PDMShell\\PDMCLI.exe\" runscript \"C:\\Scripts\\clearvariables.pdmshell\" \"FilePath\" \n\n### Example Script\n\nIn the PDMShell script (`clearvariables.pdmshell`), you can reference the parameters as follows:\n\n# Check the selected file out\ncheckout -filePath \"$parameter1$\"\n\n# clear description variable\nsetvar -filePath \"$parameter1$\" -variableName Description -Value \"\"\n\n# Save changes\ncheckin -filePath \"$parameter1$\" -comment \"cleared description\"\n# cd to root folder\ncd\\\n# cd to logs folder\ncd logs\n# save log\ndump clearvariables_$yyyy-$mm-$dd_$guid.txt\n# You must call quit at the end of the script\nquit\n\nTutorial\n<video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/workflowtransition.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>\n\nTips for Running PDMShell Scripts from Workflow Transitions\n- **Test Your Scripts**: Always test your PDMShell scripts independently before integrating them with workflow transitions.\n- **Use Quotes for Paths**: Wrap paths and parameters in quotes (`\"\"`) if they contain spaces to avoid errors.",
    "keywords": [
      "scriptsfromtransition",
      "notes",
      "about",
      "running",
      "pdmshell",
      "scripts",
      "workflow",
      "transitions"
    ],
    "category": "scripting"
  },
  {
    "id": "search",
    "title": "SEARCH Command",
    "content": "DESCRIPTION:\nThe `search` command allows users to search for files and folders in the current directory. It supports recursive searches, filtering, and output customization.\n\nSYNTAX:\n\nsearch -search -recursive -includesubfolders -csv -columns -duplicatesstrategy\n\nPARAMETERS:\n- `search`: Search keyword. This supports SQL wildcard %.\n\n- `recursive`: Searches through all subdirectories recursively.\n\n- `includesubfolders`: Includes subfolders in the search results.\n\n- `csv`: Outputs the search results in CSV format.\n\n- `columns`: Specifies the columns to include in the output seperated by a comma.\n\n- `duplicatesstrategy`: Defines how duplicate results are resolved when DuplicatedBy is specified in the search query. You must `DuplicatedBy` token in the `search` parameter. \n\n**Special columns**: You can use `FileDate`, `Version`, `State` and `Hash` to list information that is not captured in the datacard. This is useful when searching for duplicates. The hash requires that the file be locally cached. Example:\n\n```bash \nlists all duplicates in the current directory by name and prints their file date, hash and revision\nsearch -search \"Name=%.sld%;Recursive=true;DuplicatedBy=Name\" -columns \"FileDate,Hash,Revision\"\n\nWe have introduced Advanced Search capabilities that can be used in the `-search` parameter. Please see more information [here](advancedsearch.md).\n\nEXAMPLES:\n### Example 1: Basic Search\n\nsearch -search % # prints all the files in the current directory\n\nPerforms a basic search in the current directory.\n\n### Example 2: Recursive Search with Subfolders\n\nsearch -search -recursive -includesubfolders # prints all the files and folders in the current directory\n\nSearches all files and folders, including subdirectories.\n\n### Example 3: Export Results to CSV\n\nsearch -search -csv -columns \"Description,PartNumber\" # Prints all the files in the current directory with their descriptions and part numbers\n\nExports the search results to a CSV file with specified columns.\n\nDUPLICATE STRATEGY OPTIONS\n\nThe following strategies are supported for the `-duplicatesstrategy` parameter:\n\n| Strategy | Description |\n|-----------|-------------|\n| KeepNewest | Keeps the newest file in each duplicate group. |\n| ExcludeNewest | Excludes the newest file and keeps the remaining duplicates. |\n| KeepOldest | Keeps the oldest file in each duplicate group. |\n| ExcludeOldest | Excludes the oldest file and keeps the remaining duplicates. |\n| KeepHighestVersion | Keeps the file with the highest PDM version. |\n| ExcludeHighestVersion | Excludes the file with the highest PDM version. |\n| KeepLowestVersion | Keeps the file with the lowest PDM version. |\n| ExcludeLowestVersion | Excludes the file with the lowest PDM version. |\n| KeepLatestRevision | Keeps the file with the latest revision value. |\n| ExcludeLatestRevision | Excludes the file with the latest revision value. |\n| KeepLargest | Keeps the file with the largest file size. |\n| ExcludeLargest | Excludes the file with the largest file size. |\n| KeepSmallest | Keeps the file with the smallest file size. |\n| ExcludeSmallest | Excludes the file with the smallest file size. |\n\nLists all duplicates in the current directory by name and prints their file date, hash and revision\nsearch -search \"Name=%.sld%;Recursive=true;DuplicatedBy=Name\" -duplicatesstrategy KeepNewest -columns \"FileDate,Hash,Revision\"\n\n![duplicatedby](image.png)\n\nNOTES:\n- Ensure the current directory is set correctly before running the command.\n- Use the `-columns` parameter to customize the output format. Data is pulled from @ for configuration-supported documents.\n\nTUTORIAL:\n <video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/search.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>",
    "keywords": [
      "search",
      "recursive",
      "includesubfolders",
      "csv",
      "columns",
      "duplicatesstrategy",
      "duplicatedby",
      "filedate",
      "version",
      "state",
      "hash"
    ],
    "category": "search"
  },
  {
    "id": "searchfromsource",
    "title": "SEARCHFROMSOURCE Command",
    "content": "DESCRIPTION\nThe `searchfromsource` command reads a **CSV source file** and uses the **first column** (ignoring the header) as input items to search for in the vault. \n\nFor every row in the source CSV, PDMShell performs a vault search and returns information such as:\n\n- File ID  \n- Full vault path  \n- Parent folder ID  \n- Checked-out status  \n- Where Used parent file IDs  \n\nOptionally, the command can write the results to a CSV file and add/update that CSV in the vault.\n\n---\n\nSYNTAX\n\nsearchfromsource -filePath -recursive -csv\n\n---\n\nPARAMETERS\n\n### `filePath`\nPath to the **source CSV file** to read input values.\n\n- If the path is **absolute**, PDMShell uses it directly.\n- If the path is **relative**, PDMShell combines it with the current directory.\n\nThe source file must exist in the vault (so it can be downloaded locally and read).\n\n---\n\n### `recursive`\nIf specified, the search will recursively search through all subfolders.\n\n- When omitted: search is performed in the current directory scope (non-recursive).\n- When included: recursive search is enabled.\n\n---\n\n### `csv`\nOptional output CSV file name/path.\n\nIf provided, the command will write the search results to a CSV file containing one row per input item.\n\nSupported behaviors:\n- If the CSV file already exists in the vault, PDMShell will attempt to overwrite/update it.\n- If the CSV file does not exist, PDMShell will create it and add it to the vault.\n\n---\n\nINPUT CSV FORMAT\n\nThe command reads:\n\n- Comma-delimited CSV\n- First row is treated as a header and ignored\n- Only the **first column** is used\n\nExample:\n\nFileName  \npart1.sldprt  \nasm_top.sldasm  \ndrawing1.slddrw  \n\nNotes:\n- **THE VALUES CAN BE A SEARCH QUERY. PLEASE SEE** [ADVANCED SEARCH ARTICLE FOR MORE INFORMATION](advancedsearch.md).\n- Empty rows are ignored\n- Values are trimmed\n- Each value becomes the search input token\n\n---\n\n### Input Example 1: Plain file names (most common)\n\nThis is the simplest format where the first column contains exact file names:\n\nFileName  \nbracket.sldprt  \nframe.sldasm  \ncover.sldprt  \nmotor_mount.sldprt  \n\nHow it behaves:\n- Each row is searched individually\n- PDMShell tries to locate the file in the vault (based on your current folder and `-recursive` flag)\n\n---\n\n### Input Example 2: File names with extensions mixed (multi-document types)\n\nYou can mix parts, assemblies, drawings, PDFs, etc.\n\nFileName  \n100023.sldprt  \n100023.slddrw  \nDatasheet_100023.pdf  \nSpecSheet.docx  \n\nHow it behaves:\n- Each row is treated as a separate lookup item\n- Results are returned only if PDM finds a matching file\n\n---\n\n### Input Example 3: Using wildcards (`%`) in the input\n\nIf your source file contains wildcard patterns, each row can be used as a search token:\n\nQuery  \n\n%.sldprt  \n%.sldasm  \n%.slddrw  \n\nHow it behaves:\n- Each row becomes its own search query\n- Useful for generating bulk reports from common patterns\n\n---\n\n### Input Example 4: Advanced Search expressions in the input\n\nYou can pass more powerful search values in the first column (same idea as `-search` in the `search` command).\n\nQuery  \n\n\"Name=%.slddrw\"  // all drawings \n\"Name=%.sldprt;Locked=true\" // All parts that are checked out   \n\nHow it behaves:\n- Each row is passed directly into the search engine\n- Results depend on your Advanced Search capabilities and syntax rules\n\nFor full syntax and supported fields/operators, see: [advancedsearch.md](advancedsearch.md)\n\n---\n\nOUTPUT CSV FORMAT\nWhen `-csv` is used, PDMShell generates the following columns:\n\nID,FileName,Path,ParentFolderID,ParentFolder,IsCheckedOut,WhereUsedIds\n\n### Column Definitions\n- **ID**: PDM file ID returned by search  \n- **FileName**: The original value read from the source CSV first column  \n- **Path**: Full vault path returned by the search result  \n- **ParentFolderID**: Folder ID containing the file  \n- **ParentFolder**: Folder path (derived from the result path)  \n- **IsCheckedOut**: `True/False` based on PDM lock status  \n- **WhereUsedIds**: Comma-separated list of parent file IDs (from the reference tree)\n\n---\n\nEXAMPLES\n\n### Example 1: Run search from a source CSV\n\nsearchfromsource -filePath \"input.csv\"\n\nReads `input.csv` and searches each row item.\n\n---\n\n### Example 2: Recursive search\n\nsearchfromsource -filePath \"input.csv\" -recursive\n\nSearches for each item recursively through subfolders.\n\n---\n\n### Example 3: Export results to a CSV file\n\nsearchfromsource -filePath \"input.csv\" -recursive -csv \"results.csv\"\n\nWrites results into `results.csv`.  \nIf `results.csv` exists in the vault, the command attempts to update it.  \nIf it does not exist, the command creates it and adds it to the vault.\n\n---\n\nNOTES\n- This command requires the user to be logged in to a vault.\n- The input CSV must be accessible locally (PDM will download the file when needed).\n- If the vault search yields no result for a row, the command prints a warning and continues.\n- Output CSV values are CSV-escaped (commas, quotes, newlines).\n- Where Used results are generated using the reference tree lookup.\n\n---\n\nLIMITATIONS\n- Only the first search result is used (`GetFirstResult()`).\n- Only file results are processed (folder results are ignored).\n- The input file is interpreted as comma-delimited CSV only.",
    "keywords": [
      "searchfromsource"
    ],
    "category": "search"
  },
  {
    "id": "setrevision",
    "title": "SETREVISION Command",
    "content": "DESCRIPTION:\n\nThe `SetRevisionCommand` allows you to set the **PDM-managed revision** of a file inside the vault.  \nThis command updates the official **PDM Revision** (the value shown on the version tab), *not* the datacard one.\n\nYou may set the revision using:\n- **%nextrevision%** — moves the revision forward  \n- **%previousrevision%** — moves the revision backward  \n- **%initial%** — resets to the first revision in the revision scheme  \n\nYou can also use **PDM variables** by enclosing them in brackets:  \nExample: `[Revision]`  \nThis evaluates the variable on the file and applies its value as the new revision.\n\nThe command resolves all bracketed variables before applying the revision.\n\nSYNTAX:\n\nsetrevision -filePath|-search -value \n\nPARAMETERS:\n\n- `filePath`  \n  Path to the file whose revision you want to update.  \n  Only a single file is affected by this command.\n\n- `search`  \n  Search query in the current folder\n\n- `value`  \n  The revision value to apply.  \n  This can be:\n  \n  - `%nextrevision%` → increments the PDM revision counter  \n  - `%previousrevision%` → decrements the PDM revision counter  \n  - `%initial%` → resets revision to the scheme’s first value  \n  - `[VariableName]` → evaluates the PDM variable and uses its value  \n  - A literal revision string supported by the vault’s revision scheme  \n\n- `csv` (only valid with `search`)\n  Save results to a csv file\n\n### NOTES:\n\n- This command affects **only the PDM Revision**, not custom properties or configuration-specific metadata.  \n- When using `[VariableName]`, ensure the variable is present on the file card.  \n- `%previousrevision%` will adjust the counter only if the revision scheme allows backward movement.  \n- `%nextrevision%` respects all revision scheme rules defined in the PDM Administration tool.\n\n# AVAILABILITY \n- 3.0.11",
    "keywords": [
      "setrevision"
    ],
    "category": "version-control"
  },
  {
    "id": "setrevisionfromsource",
    "title": "SETRECISIONFROMSOURCE Command",
    "content": "DESCRIPTION\n\nThe `SetRecisionFromSourceCommand` allows you to batch-update the **PDM-managed revision** for multiple files by reading values from a CSV input source.\n\nThe **source CSV** must contain at minimum:\n\n- **Id** → the PDM file ID  \n- **Value** → the revision value to apply  \n\nThis command applies the revision exactly as supplied in the CSV just like in the [set revision command](SETREVISION.md).  \nIt does  **evaluate** `%nextrevision%`, `%previousrevision%`,`%initial%`, or bracketed variables—only literal revision values.\n\nYou may optionally output a **results CSV** that includes success/failure information for each processed row.\n\nSYNTAX\n\nsetrevisionfromsource -source -csv\n\nPARAMETERS\n\n- `-source`  \n  Path to the CSV file that contains the input dataset.  \n  Required columns:  \n  - `ID` — the file’s PDM ID inside the vault.  \n  - `Revision` — the revision string supported by the revision scheme  \n\n![setrevisionfromsource](/images/setrevisionfromsource.png)\n\n You can generate IDs and variables into a CSV by using the [search command](SEARCH.md).\n\n- `-csv` *(optional)*  \n  Path to an output CSV file where results will be written.  \n  The results file contains:  \n  - File ID  \n  - Operation status  \n  - Error message (if any)\n\nEXAMPLAES\n\nsetrevisionfromsource -source source.csv -csv results.csv\n\nNOTES\n\n- This command updates the **PDM Revision** shown on the Version tab, not datacard variables.  \n- All revisions must already exist in the active revision scheme.  \n- If a file ID does not exist or cannot be updated, the error will be logged and processing continues for the remaining records.  \n- Output CSV is optional; if omitted, results are printed to console only.\n\nAVAILABILITY\n- 3.0.12",
    "keywords": [
      "setrevisionfromsource",
      "setrecisionfromsource"
    ],
    "category": "version-control"
  },
  {
    "id": "setvar",
    "title": "SETVAR Command",
    "content": "DESCRIPTION:\nSets the value of a variable for a specified checked out file or many checked out files.\n\nSYNTAX:\n\nsetvar [-filePath|-search]  -variableName -value [-configNames] [-stringformat] \n\nPARAMETERS:\n-`filePath`: The file to set the variable for.\n\n-`variableName`: The variable to set.\n\n-`value`: The value to assign to the variable.\n\n-`configNames`: The configuration names to set the variable for, separated by commas.\n\n-`search`: The search operation to use.\n\n-`stringformat`: string format. See remarks section. \n\nEXAMPLES:\n\nsetvar -filePath file1.sldprt -variableName Description -value $value -stringformat UpperCase # Upper case the current value.\n\nEVALUATION:\nThe `value` parameter gets evaluated by PDMShell. This feature allows you to use placeholders in the new value, which will be replaced with actual values from the file or folder. This can be useful to dynamically generate new values based on file or folder properties or other variables. The following placeholders are supported:\n\nPlease read more information about placeholder evaluation [here](EVAL.md).\n\nREMARKS\n- The `configNames` parameter should be separated by commas. If omitted, PDMShell uses `@` for configuration-supported documents.\n- The `search` parameter searches the current directory and does not drill down. The search query is a PDM one, so you can use `%` for wildcard.\n- The `stringformat` parameter allows you to format the value of the variable using predefined string formatting options. The following formats are supported:\n  - **UpperCase**: Converts the entire string to uppercase.\n  - **LowerCase**: Converts the entire string to lowercase.\n  - **CamelCase**: Converts the string to camel case, where the first word is lowercase, and subsequent words are capitalized (e.g., `exampleString`).\n  - **FirstLetterCase**: Capitalizes the first letter of the string and converts the rest to lowercase (e.g., `Example`).\n\nTUTORIAL:\n <video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/setvar.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>\n\nCHANGELOGS\n- As of version [3.0.9](releasenotes.md), we have added support for setting folder daracard variables",
    "keywords": [
      "setvar",
      "filepath",
      "variablename",
      "value",
      "confignames",
      "search",
      "stringformat"
    ],
    "category": "variables"
  },
  {
    "id": "setvarsfromsource",
    "title": "SETVARSFROMSOURCE Command",
    "content": "DESCRIPTION:\nSets variables for multiple files using a CSV file as the source.\n\nSYNTAX:\n\nsetvarsfromsource -source -evaluatealias\n\nPARAMETERS:\n-`source`: The CSV file containing the file IDs and variable values.\n-`evaluatealias`: See dynamic placeholder article for more details.\n\nCSV FILE FORMAT:\nThe CSV file should have the following format:\n\nFileID,Variable1,Variable2,... \nXXXX,Value1,Value2,... \nXXXX,Value1,Value2,...\n\nEXAMPLES:\n\nsetvarsfromsource -source variables.csv # the source file must be exist in the current directory\n\nREMARKS:\n- The CSV file should have the first column as the file ID and the subsequent columns as the variable names.\n- You need to include the extension in the filename. This file can be outside the vault.\n- The best way to generate a source CSV is to use the `dir` command or the `search` command on a folder with the `-csv` parameter and the `columns`, like:\n\ndir -columns Description,\"Part Number\" -csv data.csv\nsearch -search %.sldprt -recursive -columns Description,\"Part Number\" -csv data.csv #this will save all parts from all levels in the current directory with the columns Description and Part Number\n\nTUTORIAL:\n <video src=\"https://bluebyte.biz/wp-content/pdmshellvideos/setvarsfromsource.mp4\" autoplay muted controls style=\"width: 100%; border-radius: 12px;\"></video>",
    "keywords": [
      "setvarsfromsource",
      "source",
      "evaluatealias"
    ],
    "category": "variables"
  },
  {
    "id": "start",
    "title": "START Command",
    "content": "DESCRIPTION:\nThe `start` command is used to launch programs, tools, or specific applications. It supports launching SOLIDWORKS, the PDM administration tool, Notepad, Windows Explorer, and other custom programs. Additionally, it can open the SOLIDWORKS API help file or the current folder in Explorer.\n\nSYNTAX:\n\nstart -process -swversion\n\nPARAMETERS:\n- **`process`**:  \n  *(Optional)* Specifies the program to start. Common values include:  \n  - `admin`: Launches the PDM administration tool.  \n  - `notepad`: Launches Notepad.  \n  - `apihelp`: Opens the SOLIDWORKS API help file.  \n  - `explorer`: Opens Windows Explorer.  \n  - `.`: Opens the current folder in Windows Explorer.  \n\n- **`swversion`**:  \n  *(Optional)* Specifies the version of SOLIDWORKS to launch. The year should be provided (e.g., `2023`).\n\nEXAMPLES:\n  \n   ```bash\n# Launch the PDM administration tool.  \n   start admin\n   ```\n\nREMARKS:\n- **Launching SOLIDWORKS**:  \n  If the `-wversion` parameter is provided, the command attempts to locate and launch the specified version of SOLIDWORKS. If the version is not found, an error message will be displayed.\n\n- **Administration Tool**:  \n  The `admin` option launches the PDM administration tool. Ensure the tool is installed and accessible.\n\n- **Notepad**:  \n  The `notepad` option launches the default Notepad application from the system directory.\n\n- **API Help**:  \n  The `apihelp` option opens the SOLIDWORKS API help file (`api_gb.chm`) from the PDM installation directory.\n\n- **Explorer**:  \n  The `explorer` option opens Windows Explorer. Using `.` opens the current folder.\n\n- **Error Handling**:  \n  If the specified program or process cannot be found, an error message will be displayed.",
    "keywords": [
      "start",
      "process",
      "admin",
      "notepad",
      "apihelp",
      "explorer",
      "swversion",
      "2023"
    ],
    "category": "system"
  },
  {
    "id": "taskscript",
    "title": "Run Script as a Task",
    "content": "Overview\n\n<div style=\"position: relative; padding-bottom: 42.1875%; height: 0;\"><iframe src=\"https://www.loom.com/embed/8dd02ac8f0fa43a48541b04bc3ef114f\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen style=\"position: absolute; top: 0; left: 0; width: 100%; height: 100%;\"></iframe></div>\n\n---\n\n**TaskScript** is a custom PDM task add-in developed by **Blue Byte Systems Inc.** that allows you to execute **PDMShell scripts** the same way you would use the built-in **Convert** task.\n\nTaskScript is found in your Blue Byte Systems Inc [account](https://bluebyte.biz/account) for users with the premium version (active license). You can download also TaskScript using [PDMDeploy](https://docs.bluebyte.biz/src/cdpdm.html).\n\nWith TaskScript, administrators can create configurable tasks that run custom `.pdmshell` scripts using the `pdmcli` engine on selected files within the vault.\n\nKey Features\n\n- Execute PDMShell commands in response to PDM task triggers\n- Dynamic script editing and variable binding\n- Reuses existing scripts stored locally or downloaded\n- Supports file filtering based on extensions\n- Evaluates placeholders like `$fileName`, `$localPath`, and more\n- Handles script failure with detailed logging\n\n---\n\nPDMShell Scrit page\n![TaskScript UI](../images/taskscript.png)\n\n### 1. **Available Scripts (BLUE BYTE SYSTEMS)**\n\n- A dropdown list showing available `.pdmshell` scripts.\n- These can be downloaded.\n- Selecting a script from the list loads it into the editor.\n\n### 2. **Buttons**\n\n- **DOWNLOAD SELECTED**  \n  Downloads the currently selected script file.\n\n- **REQUEST A SCRIPT**  \n  Opens a preformatted email to `amen@bluebyte.biz` with the subject **\"Script Request\"**.\n\n- **REFRESH**  \n  Reloads the available script list.\n\n### 3. Script Editor\n\n- A multi-line editable area for entering or modifying `.pdmshell` scripts.\n- Lines starting with `#` are treated as **comments**.\n- Syntax highlighting shows comments in *italic green* for better readability.\n\n### 4. Extensions and test button\n - Specify the extensions to process.\n - **TEST WITH FILE** allows to test your script before running it.\n---\n\nExample Script\n\ncd/\nprint -id $id\n\nYou can request a script by emailing us via the Request Script button.\n\nRemarks\n\n- You can include the extensions: `sldprt;sldasm;slddrw` are the default value.\n- TaskScript will run PDMShell sessions on all affected documents by the task.\n- Do not forget to set the Command Menu tab.\n\nPlaceholder Variables\n\nTaskScript supports dynamic variables that are replaced at runtime for each selected file. Below is a list of available placeholders:\n\n| Placeholder                  | Description                                                      |\n|-----------------------------|------------------------------------------------------------------|\n| `$localPath`                | Full local path to the selected file                            |\n| `$fileName`                 | File name (including extension)                                 |\n| `$fileNameWithoutExtension` | File name without the extension                                 |\n| `$name`                     | Alias for file name                                             |\n| `$extension`                | File extension                                                  |\n| `$id`                       | Internal PDM file ID                                            |\n| `$GUID`                     | Unique Identifier                                               |\n| `$taskName`                 | Name of the running task                                        |\n| `$folderPath`               | Full local path to the file's parent folder                     |\n| `$folderID`                 | Internal PDM folder ID                                          |\n| `$vaultName`                | Name of the vault the file belongs to                           |\n| `$vaultRootFolder`          | Local root path of the vault                                    |\n| `$(Variable.Configuration)` | Value of a custom PDM variable for a given configuration        |\n| `$machineName`              | Name of the current machine                                     |\n| `$computerName`             | Alias for machine name                                          |\n| `$userName`                 | Logged-in PDM user name                                         |\n| `$windowsUser`              | Windows user name                                               |\n| `$userDomain`               | Windows domain name                                             |\n| `$domain`                   | Alias for domain name                                           |\n| `$yyyy`                     | Current year (4 digits)                                         |\n| `$yy`                       | Current year (2 digits)                                         |\n| `$MM`                       | Month (2 digits)                                                |\n| `$M`                        | Month (no leading zero)                                         |\n| `$dd`                       | Day (2 digits)                                                  |\n| `$d`                        | Day (no leading zero)                                           |\n| `$month`                    | Full month name (e.g., January)                                 |\n| `$mon`                      | Short month name (e.g., Jan)                                    |\n| `$day`                      | Full day name (e.g., Monday)                                    |\n| `$dayShort`                 | Short day name (e.g., Mon)                                      |\n| `$HH`                       | Hour (24-hour format)                                           |\n| `$hh`                       | Hour (12-hour format)                                           |\n| `$mm`                       | Minutes                                                        |\n| `$ss`                       | Seconds                                                        |\n| `$tt`                       | AM/PM designator                                               |\n| `$timestamp`                | Combined date and time (yyyyMMdd_HHmmss)                        |\n| `$date`                     | Current date (yyyy-MM-dd)                                       |\n| `$time`                     | Current time (HH-mm-ss)                                         |\n\n$(Variable.Configuration)\n- Use `@` for the `@` tab. Example: `$(Description.@)`\n- Use empty string for files with no configurations. Example: `$(Description. )`",
    "keywords": [
      "taskscript",
      "run",
      "script",
      "task"
    ],
    "category": "scripting"
  },
  {
    "id": "testimonials",
    "title": "PDMShell Testimonials",
    "content": "**“Your website is very user-friendly. The tutorials are very easy to follow, and it only took me about 10 minutes to update variables from a CSV using the `setvarfromsource` command. Very well done!”**\n— PDMShell User",
    "keywords": [
      "testimonials",
      "pdmshell"
    ],
    "category": "general"
  },
  {
    "id": "transition",
    "title": "TRANSITION Command",
    "content": "DESCRIPTION\n\nThe `transition` command is used to move SOLIDWORKS PDM files from one workflow state to another using a specified transition.\n\nThis command supports three modes:\n\n- Batch transition using CSV source (recommended for large migrations)\n- Search-based transition\n- Single file transition\n\n# SYNTAX\n\n# single file\ntransition -transitionid <id> -filePath <path>\n# search and transition all results\ntransition -transitionid <id> -search <pattern> [-recursive]\n# transition all files in the csv via the specified transition\ntransition -source <csv> -password <password> [-batch <size>] [-comment <text>]\n\n# PARAMETERS\n\ntransitionid\nSpecifies the workflow transition ID.\nRequired for search and filepath modes.\n\nExample:\n\n-transitionid 12\n\nsource\n\nSpecifies a CSV file containing files to transition in batch.\n\nThe CSV may be:\n- Absolute path\n- Relative to current directory\n\nExample:\n\n-source transitions.csv\n\nThe file must be locally cached.\n\npassword\n\nSpecifies the PDM user password required to execute the transition.\nOnly used with `source` parameter.\nExample:\n\n-password mypassword\n\nYour password remains visible in your session output. Do not start PDMShell with winlog parameter.\n\nbatch\n\nSpecifies how many files to process per batch.\n\nDefault:\n1000\nExample:\n\n-batch 5000\n\nRecommended values:\n500\n\ncomment\n\nSpecifies the transition comment.\n\nDefault:\n\nTransitioned by PDMShell\n\nExample:\n\n-comment \"Released by migration script\"\n\n---\n\nsearch\n\nSearches for files matching a pattern in the current directory.\n\nExample:\n\n# find all parts in the current directory\n-search %.sldprt\n\n---\n\nrecursive\n\nIncludes subfolders when used with search.\n\n---\n\nfilePath\n\nSpecifies a single file to transition.\n\nExample:\n\n# part is found the current directory\n-filePath part.sldprt\n\n---\n\n# CSV FORMAT\n\nRequired format:\n\nFileID,ParentFolderID,TransitionID\n\nExample:\n\nFileID,ParentFolderID,TransitionID\n34521,1201,15\n34522,1201,15\n34523,1205,18\n\n![transition.csv](/images/transitioncsv.png)\n---\n\n# BATCH MODE (SOURCE)\n\nThis is the recommended mode for:\n\n- Data migrations\n- Vault cleanup\n- Bulk state changes\n- Automation\n\nSupports hundreds of thousands of files.\n\nExample:\n\ntransition -source transitions.csv -password mypass -batch 2000\n\n---\n\n# IMPORTANT CONSIDERSATIONS FOR BATCH MODE\n\n![ReferenceDialogSettings](/images/ReferenceDialogSettings.png)\n\nPDMShell batch transitions are affected by the logged-in user’s Reference Dialog settings. If “Select child references during state change” and “Select references that are defined as drawing nodes during state change” are enabled, PDM will also transition referenced files, not just the source files from the CSV. If you want PDMShell batch mode to transition only the source files, these options must be disabled for the logged-in user.\n\n# SEARCH MODE\n\nTransitions files found using search.\n\nExample:\n\ntransition -search %.sldasm -transitionid 12 -recursive\n\n \n\n# SINGLE FILE MODE\n\nTransitions one file.\n\nExample:\n\ntransition -filePath part.sldprt -transitionid 12\n\n \n\n# VALIDATION\n\nThe command automatically:\n\n- Validates transition IDs\n- Validates workflow permissions\n- Validates file state eligibility\n- Skips invalid files\n\n# LICENSE LIMITATIONS\n\nFree version limits number of files processed.\n\nTo remove limit: https://bluebyte.biz/product/pdmshell\n\n# BEST PRACTICES\n\n- Use source mode for large operations.\n- Use batch size between 500 and 5000.\n- Always test with small batch first.\n- Backup vault before large operations.",
    "keywords": [
      "transition"
    ],
    "category": "general"
  },
  {
    "id": "undocheckout",
    "title": "UNDOCHECKOUT Command",
    "content": "DESCRIPTION:\nUndoes a checkout operation.\n\nSYNTAX:\n\nundocheckout [-filePath | -search]\n\nPARAMETERS:\n- `filePath`: The file to undo the checkout for.\n\n- `search`: The search operation to use.\n\nEXAMPLES:\n\nundocheckout -f \"file1.sldprt\"\n\nREMARKS:\n- The search parameter searches the current directory and does not drill down. The search query is a PDM one, so you can use `%` for wildcard.",
    "keywords": [
      "undocheckout",
      "filepath",
      "search"
    ],
    "category": "version-control"
  },
  {
    "id": "updatereferences",
    "title": "UPDATEREFERENCES Command",
    "content": "DESCRIPTION\nUpdates file references inside the SOLIDWORKS PDM vault.\n\nThe `updatereferences` command modifies references stored **inside files**, without opening SOLIDWORKS, and allows you to:\n\n- Update references for a **single file**\n- Update references for **multiple files using a search**\n- Resolve references by locating matching files inside a specified directory\n- Control which references are updated using a **scope** parameter\n\nThis command is especially useful for fixing broken references, updating references after migrations, or correcting references that point outside the vault.\n\nSYNTAX\n\nupdatereferences -filepath -search -directory -scope -recursive -csv\n\nPARAMETERS\n\n- `filepath`  \n  Optional. Updates references for a single file.  \n  - If a relative path is provided, it is resolved against the current directory.\n  - When specified, the `search` parameter is ignored.\n\n- `search`  \n  Optional. Search query used to find files whose references should be updated.  \n  - The search is scoped to the current directory.\n  - Supports `%` wildcards.\n  - Can be combined with `recursive`.\n\n- `directory`  \n  Optional. Defines where replacement references are searched.  \n  Only files found under this directory will be used when resolving and updating references.\n\n- `scope`  \n  Optional. Controls which references are updated.  \n  Valid values:\n  - `UpdateOutsideVaultReferenceOnly` – Updates references that point outside the vault\n  - `UpdateBrokenReferences` – Updates references that are missing or broken\n  - `UpdateAllReferences` – Updates all references found in the file\n\n- `recursive`  \n  Optional. When used with `search`, includes subfolders of the current directory when locating files whose references should be updated.\n\n- `csv`\n  Saves the update references operations in a csv file.\n\nBEHAVIOR\n\n- Operates directly on file reference data\n- Does not open SOLIDWORKS\n- **Requires files to be checked out**\n- Uses vault searches to locate replacement references\n- Updates references by matching file names inside the specified directory scope\n- Commits changes directly back into the file\n\nEXAMPLES\n\n###  Update only references that point outside the vault\n\nupdatereferences -filepath speaker.sldasm -directory Libraries -scope UpdateOutsideVaultReferenceOnly\n\n### Update broken references for all assemblies in the current folder\n\nupdatereferences -search %.sldasm -scope UpdateBrokenReferences\n\n \nREMARKS\n\n- Either `filepath` or `search` must be specified.\n- If both are provided, `filepath` takes precedence.\n- The `search` parameter only searches within the current directory unless `recursive` is specified.\n- Reference resolution is based on matching file names within the directory scope.\n- The first matching file found is used to update the reference.\n- This command modifies files directly; use with care in controlled workflows.",
    "keywords": [
      "updatereferences"
    ],
    "category": "file-management"
  },
  {
    "id": "users",
    "title": "USERS Command",
    "content": "DESCRIPTION:\nLists all the users in the active vault.\n\nSYNTAX:\n``bash\nusers\n\nPARAMETERS:\n\nEXAMPLES:\n\nusers",
    "keywords": [
      "users"
    ],
    "category": "authentication"
  },
  {
    "id": "version",
    "title": "VERSION Command",
    "content": "DESCRIPTION:\n\nDisplays version information for PDMShell, installed SOLIDWORKS, or the PDM client.\n\nSYNTAX:\n\nversion -solidworks -pdm\n\nPARAMETERS:\n- No parameters: Displays the version of PDMShell.\n\n- `solidworks`: Displays the versions of installed SOLIDWORKS. **RESERVED FOR FUTURE. NOT IMPLEMENTED**\n- `pdm`: Displays the version of the installed PDM client. **RESERVED FOR FUTURE. NOT IMPLEMENTED**\n\nPARAMETERS:\nSOLIDWORKS - List versions of installed SOLIDWORKS\n\nEXAMPLES:\n\nversion -solidworks\n# lists all the installed solidworks versions",
    "keywords": [
      "version",
      "solidworks",
      "pdm"
    ],
    "category": "system"
  },
  {
    "id": "versionupgrade",
    "title": "VERSIONUPGRADE Command",
    "content": "DESCRIPTION:\n\nThe `VersionUpgradeCommand` provides tools for **bumping PDM revisions**, **validating file references**, and **exporting broken reference results to a CSV file**.\n\nA SOLIDWORKS file upgrade increments the file version and thus the revision. Use `-bumprevision` reset to the revision back to the previous value prior to the file upgrade.\n\nThis command uses PDM’s internal engine to:\n\n- Increment revision numbers in bulk  \n- Detect incorrect, missing, or version-mismatched references  \n- Output the reference check results to a CSV file that can be added or updated inside the PDM vault  \n\nThe CSV export uses the fields of the `EdmCheckRef` structure:\n\n- `mlParentFileID`  \n- `mlRefFileID`  \n- `mbsParentPath`  \n- `mbsRefPath`  \n- `mlRefVersion`  \n- `mlRefLatestVersion`  \n- `mlRefFolderID`  \n\nEach result row represents a reference that is out of date, missing, or mismatched according to PDM rules.\n\n---\n\nSYNTAX:\n\nversionupgrade -search <query> [-recursive] [-bumprevision] [-referencescheck] [-csv <fileName>]\n\n---\n\nPARAMETERS:\n\n- `search`  \nSearch query used to locate files for the version upgrade operation.  \nIf omitted, no files will be processed.\n\nConsult [advanced search](advancedsearch.md) to learn how to create advanced search queries.\n\n- `recursive`   \n  Searches through all subfolders from the current folder. Not required if using `Recursive=true` in `search`.\n\n- `bumprevision`  \n  Increments the PDM revision of each file returned from the search.  \n  Requires the logged-in user to have the permission:  \n  **Modify revision numbers (EdmSysRight_ModifyRevisionNumbers)**.\n\n- `referencescheck`  \n  Runs PDM’s **Reference Check**.\n  This detects:\n\n  - Missing references  \n  - Wrong versions  \n  - Outdated references  \n  - Broken or invalid reference paths  \n\n   Any issues found are stored in an internal list and may be exported via the `csv` parameter.\n\n- `csv`  \n  Exports reference-check issues to a CSV file.  \n  If the file exists in the vault, it is **updated**.  \n  If the file does not exist, it is **added** to the vault.\n\nThe CSV contains:\n\nParentFileID,RefFileID,ParentPath,RefPath,RefVersion,RefLatestVersion,RefFolderID\n\n### Behavior notes for CSV:\n- Fully-qualified paths inside the vault are handled correctly.  \n- CSV escaping is applied (quotes, commas, newlines).  \n- UTF-8 encoding without BOM is used for compatibility.  \n- If the CSV file is checked out, a warning is returned.\n\n---\n\nWORKFLOW OVERVIEW\n\n### 1. Search for files  \nThe command executes a PDM search using the supplied query and optional recursion.\n\n### 2. Perform requested operations  \nDepending on parameters:\n\n- `-bumprevision` → increments the PDM revision counters  \n- `-referencescheck` → checks all references for correctness  \n\n### 3. CSV Export (optional)  \nIf both `search` and `referencescheck` are supplied, and `csv` is specified:\n\n- Writes reference errors to a CSV  \n- Adds or updates the file in the vault  \n- Displays success, warnings, and error messages\n\n---\n\nNOTES:\n\n- `bumprevision` and `referencescheck` operate *only* on files returned by the search.\n- CSV exporting is only active when **both**  \n  `search` **and** `referencescheck` are supplied.\n- The reference check output may include many entries depending on assembly depth.\n- This command does **not** modify file content — it only updates revision metadata or reference validation results.\n- Bulk operations respect PDM permissions and may fail if the user lacks rights.\n\n---\n\nAVAILABILITY  \n-  **3.0.13**",
    "keywords": [
      "versionupgrade",
      "search",
      "recursive",
      "bumprevision",
      "referencescheck",
      "csv"
    ],
    "category": "version-control"
  },
  {
    "id": "versionupgradefromsource",
    "title": "UPGRADEVERSIONFROMSOURCE Command",
    "content": "To be implemented.",
    "keywords": [
      "versionupgradefromsource",
      "upgradeversionfromsource"
    ],
    "category": "version-control"
  },
  {
    "id": "whereused",
    "title": "WHEREUSED Command",
    "content": "DESCRIPTION:\nThe `whereused` command lists all parent files that reference a specified file.\n\nThis command helps identify assemblies or drawings that use a particular part or subassembly.\n\nThe output columns are:\n\n- ChildID  \n- ChildName  \n- ParentName  \n- ParentID  \n- FolderPath  \n\n---\n\nSYNTAX:\n\nwhereused -filepath|-search -csv\n\n---\n\nPARAMETERS:\n\n- `filepath`  \n  Full or relative path of the file to evaluate.\n\n- `search`  \n  Optional filter applied to parent results. Supports SQL wildcard `%`.\n\n- `csv` csv file name to put the results in CSV format.\n\n---\n\nEXAMPLES:\n\n### Example 1: Basic Where Used\n\nLists all parent files that reference `Bracket.SLDPRT`.\nwhereused -filepath \"C:\\Vault\\Parts\\Bracket.SLDPRT\"\n\n---\n\n### Example 2: Filter Parent Results\n\nwhereused -search \"%.SLDASM\"\nFinds the parents of all the assemblies in the current directory.\n\n---\n\n### Example 3: Export to CSV\n\nwhereused -filepath \"C:\\Vault\\Parts\\Bracket.SLDPRT\" -csv parents.csv\nExports results to CSV with columns:\nChildID,ChildName,ParentName,ParentID,FolderPath",
    "keywords": [
      "whereused",
      "filepath",
      "search",
      "csv"
    ],
    "category": "search"
  }
]
