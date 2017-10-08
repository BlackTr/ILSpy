using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using ICSharpCode.Decompiler.CSharp;
using ICSharpCode.Decompiler.CSharp.OutputVisitor;
using ICSharpCode.Decompiler.CSharp.Syntax;
using ICSharpCode.Decompiler.CSharp.Transforms;
using ICSharpCode.Decompiler.TypeSystem;
using ICSharpCode.Decompiler;
using Mono.Cecil;

namespace ILSpy
{
    public class Decompiler
    {
		public async Task<object> Decompile(object assemblyFileName)
		{
            try
            {
                ModuleDefinition module = LoadModule(assemblyFileName as string);
                var typeSystem = new DecompilerTypeSystem(module);
                CSharpDecompiler decompiler = new CSharpDecompiler(typeSystem, new DecompilerSettings());

                decompiler.AstTransforms.Add(new EscapeInvalidIdentifiers());
                SyntaxTree syntaxTree;
                syntaxTree = decompiler.DecompileWholeModuleAsSingleFile();

                var sb = new StringBuilder();
                using (var tw = new StringWriter(sb))
                {
                    await Task.Run(() =>
                    {
                        var visitor = new CSharpOutputVisitor(tw, FormattingOptionsFactory.CreateSharpDevelop());
                        syntaxTree.AcceptVisitor(visitor);
                    });
                }
                return sb.ToString();
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
		}


		public ModuleDefinition LoadModule(string assemblyFileName)
		{
			var resolver = new CustomAssemblyResolver(assemblyFileName);

			var module = ModuleDefinition.ReadModule(assemblyFileName, new ReaderParameters
			{
				AssemblyResolver = resolver,
				InMemory = true
			});

			resolver.TargetFramework = module.Assembly.DetectTargetFrameworkId();

			return module;
		}

	}
}
