import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  styles: [`
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-10px); }
    }
    .fade-up   { animation: fadeUp 0.7s ease both; }
    .fade-up-2 { animation: fadeUp 0.7s 0.15s ease both; }
    .fade-up-3 { animation: fadeUp 0.7s 0.3s ease both; }
    .float     { animation: float 4s ease-in-out infinite; }
    html { scroll-behavior: smooth; }
  `],
  template: `
    <div class="min-h-screen bg-white font-sans">

      <!-- ── Navbar ── -->
      <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100 shadow-sm">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="logo.jpg" alt="TaskHub" class="w-9 h-9 rounded-xl object-contain">
            <span class="text-xl font-extrabold text-slate-800 tracking-tight">TaskHub</span>
          </div>
          <div class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#features" class="hover:text-teal-600 transition-colors">Features</a>
            <a href="#how-it-works" class="hover:text-teal-600 transition-colors">How It Works</a>
            <a href="#why" class="hover:text-teal-600 transition-colors">Why TaskHub</a>
          </div>
          <div class="flex items-center gap-3">
            <a routerLink="/login"
               class="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors">
              Sign In
            </a>
            <a routerLink="/register"
               class="px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all shadow-md shadow-teal-200 hover:shadow-teal-300 hover:brightness-110"
               style="background: linear-gradient(135deg, #134e4a, #0d9488)">
              Get Started Free
            </a>
          </div>
        </div>
      </nav>

      <!-- ── Hero ── -->
      <section class="relative overflow-hidden pt-24 pb-32"
               style="background: linear-gradient(160deg, #f0fdfa 0%, #ffffff 60%, #f0fdfa 100%)">
        <!-- Background blobs -->
        <div class="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full opacity-20"
             style="background: radial-gradient(circle, #0d9488, transparent)"></div>
        <div class="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full opacity-10"
             style="background: radial-gradient(circle, #134e4a, transparent)"></div>

        <div class="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div class="fade-up inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-8">
            <span class="w-2 h-2 bg-teal-500 rounded-full"></span>
            Built for teams & solo achievers
          </div>

          <h1 class="fade-up-2 text-6xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
            Your Tasks.<br>
            <span style="background: linear-gradient(90deg, #134e4a, #0d9488); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              Organized. Done.
            </span>
          </h1>

          <p class="fade-up-3 text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            TaskHub is a full-stack task management app that helps you create projects,
            manage tasks on a Kanban board, and track your progress — all in one clean dashboard.
          </p>

          <div class="fade-up-3 flex flex-col sm:flex-row gap-4 justify-center">
            <a routerLink="/register"
               class="px-10 py-4 text-base font-bold text-white rounded-2xl shadow-lg shadow-teal-200 hover:shadow-teal-300 hover:brightness-110 transition-all"
               style="background: linear-gradient(135deg, #134e4a, #0d9488)">
              Start for Free →
            </a>
            <a routerLink="/login"
               class="px-10 py-4 text-base font-bold text-slate-700 bg-white rounded-2xl border border-slate-200 hover:border-teal-300 hover:text-teal-700 transition-all shadow-sm">
              Sign In
            </a>
          </div>
        </div>

        <!-- Dashboard mockup -->
        <div class="float max-w-5xl mx-auto mt-20 px-6">
          <div class="rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
               style="background: linear-gradient(135deg, #134e4a 0%, #0f766e 100%)">
            <div class="flex items-center gap-2 px-6 py-4 border-b border-white/10">
              <span class="w-3 h-3 rounded-full bg-red-400"></span>
              <span class="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span class="w-3 h-3 rounded-full bg-green-400"></span>
              <span class="ml-4 text-white/60 text-xs font-mono">TaskHub Dashboard</span>
            </div>
            <div class="p-8 grid grid-cols-3 gap-4">
              <!-- Todo -->
              <div class="bg-white/10 rounded-2xl p-4">
                <div class="flex items-center gap-2 mb-4">
                  <span class="w-2 h-2 rounded-full bg-slate-300"></span>
                  <span class="text-white/80 text-xs font-semibold uppercase tracking-wider">To Do</span>
                </div>
                <div class="space-y-2">
                  <div class="bg-white/15 rounded-xl p-3">
                    <div class="h-2 w-3/4 bg-white/40 rounded mb-2"></div>
                    <div class="h-2 w-1/2 bg-white/25 rounded"></div>
                  </div>
                  <div class="bg-white/15 rounded-xl p-3">
                    <div class="h-2 w-2/3 bg-white/40 rounded mb-2"></div>
                    <div class="h-2 w-1/3 bg-white/25 rounded"></div>
                  </div>
                </div>
              </div>
              <!-- In Progress -->
              <div class="bg-white/10 rounded-2xl p-4">
                <div class="flex items-center gap-2 mb-4">
                  <span class="w-2 h-2 rounded-full bg-yellow-400"></span>
                  <span class="text-white/80 text-xs font-semibold uppercase tracking-wider">In Progress</span>
                </div>
                <div class="space-y-2">
                  <div class="bg-white/15 rounded-xl p-3 border border-yellow-400/30">
                    <div class="h-2 w-4/5 bg-white/40 rounded mb-2"></div>
                    <div class="h-2 w-2/3 bg-white/25 rounded"></div>
                  </div>
                </div>
              </div>
              <!-- Done -->
              <div class="bg-white/10 rounded-2xl p-4">
                <div class="flex items-center gap-2 mb-4">
                  <span class="w-2 h-2 rounded-full bg-green-400"></span>
                  <span class="text-white/80 text-xs font-semibold uppercase tracking-wider">Done</span>
                </div>
                <div class="space-y-2">
                  <div class="bg-white/15 rounded-xl p-3 border border-green-400/30">
                    <div class="h-2 w-3/4 bg-white/40 rounded mb-2"></div>
                    <div class="h-2 w-1/2 bg-white/25 rounded"></div>
                  </div>
                  <div class="bg-white/15 rounded-xl p-3 border border-green-400/30">
                    <div class="h-2 w-2/3 bg-white/40 rounded mb-2"></div>
                    <div class="h-2 w-1/3 bg-white/25 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Stats ── -->
      <section class="border-y border-slate-100 bg-slate-50 py-12">
        <div class="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          <div>
            <p class="text-4xl font-extrabold text-teal-700 mb-1">3</p>
            <p class="text-sm text-slate-500 font-medium">Kanban Stages</p>
          </div>
          <div>
            <p class="text-4xl font-extrabold text-teal-700 mb-1">∞</p>
            <p class="text-sm text-slate-500 font-medium">Projects & Tasks</p>
          </div>
          <div>
            <p class="text-4xl font-extrabold text-teal-700 mb-1">100%</p>
            <p class="text-sm text-slate-500 font-medium">Secure & Private</p>
          </div>
        </div>
      </section>

      <!-- ── Features ── -->
      <section id="features" class="py-28 max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <p class="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-3">Features</p>
          <h2 class="text-4xl font-extrabold text-slate-900">Everything you need to stay on track</h2>
          <p class="text-slate-400 mt-4 max-w-xl mx-auto">Powerful features wrapped in a clean, distraction-free interface.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                 style="background: linear-gradient(135deg, #ccfbf1, #99f6e4)">
              <svg class="w-7 h-7 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-3">Project Management</h3>
            <p class="text-slate-500 leading-relaxed">Create multiple projects, each with its own dedicated task board. Keep your work neatly separated and focused.</p>
          </div>

          <!-- Feature 2 -->
          <div class="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                 style="background: linear-gradient(135deg, #fef9c3, #fde68a)">
              <svg class="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-3">Kanban Board</h3>
            <p class="text-slate-500 leading-relaxed">Drag tasks across <strong>To Do</strong>, <strong>In Progress</strong>, and <strong>Done</strong> columns. Filter by priority and get a clear view of progress.</p>
          </div>

          <!-- Feature 3 -->
          <div class="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                 style="background: linear-gradient(135deg, #ede9fe, #ddd6fe)">
              <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-3">Progress Tracking</h3>
            <p class="text-slate-500 leading-relaxed">See live completion percentages for each project on your dashboard. Know exactly where you stand at a glance.</p>
          </div>

          <!-- Feature 4 -->
          <div class="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                 style="background: linear-gradient(135deg, #fee2e2, #fecaca)">
              <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-3">Priority & Due Dates</h3>
            <p class="text-slate-500 leading-relaxed">Assign Low, Medium, or High priority to tasks. Set due dates and always know what needs attention first.</p>
          </div>

          <!-- Feature 5 -->
          <div class="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                 style="background: linear-gradient(135deg, #dcfce7, #bbf7d0)">
              <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-3">User Profiles</h3>
            <p class="text-slate-500 leading-relaxed">Personalize your account with a profile picture and username. Your workspace, your identity.</p>
          </div>

          <!-- Feature 6 -->
          <div class="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                 style="background: linear-gradient(135deg, #e0f2fe, #bae6fd)">
              <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-3">Secure Authentication</h3>
            <p class="text-slate-500 leading-relaxed">JWT-based login keeps your data private. Only you can access your projects and tasks.</p>
          </div>
        </div>
      </section>

      <!-- ── How It Works ── -->
      <section id="how-it-works" class="py-28 bg-slate-50">
        <div class="max-w-5xl mx-auto px-6">
          <div class="text-center mb-16">
            <p class="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-3">How It Works</p>
            <h2 class="text-4xl font-extrabold text-slate-900">Up and running in minutes</h2>
          </div>

          <div class="relative">
            <!-- Line connector -->
            <div class="hidden md:block absolute top-10 left-1/2 -translate-x-1/2 w-[70%] h-0.5 bg-teal-100"></div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              <div class="text-center">
                <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                     style="background: linear-gradient(135deg, #134e4a, #0d9488)">
                  <span class="text-2xl font-extrabold text-white">1</span>
                </div>
                <h3 class="text-lg font-bold text-slate-800 mb-2">Create an Account</h3>
                <p class="text-slate-500 text-sm leading-relaxed">Sign up in seconds with your email and a secure password. No credit card needed.</p>
              </div>
              <div class="text-center">
                <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                     style="background: linear-gradient(135deg, #134e4a, #0d9488)">
                  <span class="text-2xl font-extrabold text-white">2</span>
                </div>
                <h3 class="text-lg font-bold text-slate-800 mb-2">Create a Project</h3>
                <p class="text-slate-500 text-sm leading-relaxed">Give your project a name and description. Your Kanban board is ready instantly.</p>
              </div>
              <div class="text-center">
                <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                     style="background: linear-gradient(135deg, #134e4a, #0d9488)">
                  <span class="text-2xl font-extrabold text-white">3</span>
                </div>
                <h3 class="text-lg font-bold text-slate-800 mb-2">Add & Manage Tasks</h3>
                <p class="text-slate-500 text-sm leading-relaxed">Add tasks, set priorities and due dates, and move them across the board as you progress.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Why TaskHub ── -->
      <section id="why" class="py-28 max-w-7xl mx-auto px-6">
        <div class="rounded-3xl overflow-hidden grid md:grid-cols-2"
             style="background: linear-gradient(135deg, #134e4a 0%, #0f766e 100%)">
          <div class="p-14 flex flex-col justify-center">
            <p class="text-teal-300 font-semibold text-sm uppercase tracking-widest mb-4">Why TaskHub?</p>
            <h2 class="text-4xl font-extrabold text-white mb-6 leading-tight">
              Simple enough for one.<br>Powerful enough for projects.
            </h2>
            <p class="text-teal-100 text-base leading-relaxed mb-8">
              Built as a full-stack application using Angular, Node.js, and MongoDB — TaskHub demonstrates clean architecture, real-time UI updates, and thoughtful UX design.
            </p>
            <a routerLink="/register"
               class="self-start px-8 py-4 bg-white text-teal-700 font-bold rounded-2xl hover:bg-teal-50 transition-all shadow-lg text-sm">
              Get Started Free →
            </a>
          </div>
          <div class="p-14 flex flex-col gap-6 justify-center">
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-teal-400/30 flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <div>
                <p class="font-semibold text-white mb-1">Clean Kanban Interface</p>
                <p class="text-teal-200 text-sm">Intuitive columns with status filters to keep you focused.</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-teal-400/30 flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <div>
                <p class="font-semibold text-white mb-1">Real-time Progress Dashboard</p>
                <p class="text-teal-200 text-sm">See task counts and completion rates across all your projects.</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-teal-400/30 flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <div>
                <p class="font-semibold text-white mb-1">Secure JWT Authentication</p>
                <p class="text-teal-200 text-sm">Token-based auth keeps your data private and protected.</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-teal-400/30 flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <div>
                <p class="font-semibold text-white mb-1">Fully Responsive</p>
                <p class="text-teal-200 text-sm">Works seamlessly on desktop, tablet, and mobile devices.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── CTA ── -->
      <section class="py-24 text-center bg-slate-50 border-t border-slate-100">
        <div class="max-w-2xl mx-auto px-6">
          <h2 class="text-4xl font-extrabold text-slate-900 mb-4">Ready to get things done?</h2>
          <p class="text-slate-500 text-lg mb-10">Join TaskHub and start organizing your work the smart way.</p>
          <a routerLink="/register"
             class="inline-block px-12 py-4 text-base font-bold text-white rounded-2xl shadow-xl shadow-teal-200 hover:shadow-teal-300 hover:brightness-110 transition-all"
             style="background: linear-gradient(135deg, #134e4a, #0d9488)">
            Create Your Free Account →
          </a>
        </div>
      </section>

      <!-- ── Footer ── -->
      <footer class="border-t border-slate-100 py-8">
        <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <img src="logo.jpg" alt="TaskHub" class="w-7 h-7 rounded-lg object-contain">
            <span class="text-sm font-bold text-slate-700">TaskHub</span>
          </div>
          <p class="text-xs text-slate-400">Built with Angular, Node.js &amp; MongoDB</p>
          <div class="flex gap-6 text-xs text-slate-400">
            <a routerLink="/login" class="hover:text-teal-600 transition-colors">Sign In</a>
            <a routerLink="/register" class="hover:text-teal-600 transition-colors">Register</a>
          </div>
        </div>
      </footer>

    </div>
  `
})
export class LandingComponent {}
